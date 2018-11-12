import React from 'react';
import './page-list.scss';
import { IJsonPage } from '@data/json/data-pages';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ReactNode } from 'react';
import PageRepository from '@src/models/repository/page-repository';
import PageCard from '@src/components/page-card';

type PageListProps = {
    pageRepository: PageRepository;
    pages: IJsonPage[];
    lang: string;
    baseUrl: string;
    onPageClick?: (pageId: string) => void;
};

type PageListState = {};

export default class PageList extends React.PureComponent<PageListProps, PageListState> {
    render() {
        const { pages: list, lang } = this.props;

        const Animate = ({ children, ...props }: { children: ReactNode }) => (
            <CSSTransition {...props} enter={true} appear={true} exit={false} timeout={1000} classNames="fade">
                {children}
            </CSSTransition>
        );

        const toc = this.getTocComponent(list);
        const baseUrl = this.props.baseUrl;
        return (
            <div>
                <div className="page-list-wrapper">
                    <TransitionGroup className="grid-cards">
                        {list &&
                            list.map(page => {
                                const pageId = page.page_id;
                                const pageProxy = this.props.pageRepository.getPageProxy(pageId);
                                if (!pageProxy) {
                                    return null;
                                }
                                return (
                                    <Animate key={pageId}>
                                        <PageCard pageProxy={pageProxy} lang={lang} onClick={this.props.onPageClick} />
                                    </Animate>
                                );
                            })}
                    </TransitionGroup>
                </div>
            </div>
        );
    }

    protected getTocComponent(list: IJsonPage[]): JSX.Element {
        return (
            <table>
                <thead>
                    <tr>
                        <td />
                        <td>Title</td>
                        <td>Layout</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map((page: IJsonPage, idx: number) => (
                        <tr key={page.page_id}>
                            <td>{idx + 1}</td>
                            <td
                                onClick={() => {
                                    if (this.props.onPageClick) {
                                        this.props.onPageClick(page.page_id);
                                    }
                                }}
                            >
                                {page.title[this.props.lang]}
                            </td>
                            <td>{page.content.layout}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
