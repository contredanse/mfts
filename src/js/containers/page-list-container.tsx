import React from 'react';
import { PageOverlay } from '@src/components/layout/page-overlay';
import { SearchBox } from '@src/components/search-box';
import { IJsonPage } from '@data/json/data-pages';
import PageList from '@src/components/page-list';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import PageRepository from '@src/models/repository/page-repository';

type PageListContainerProps = {
    pageRepository: PageRepository;
    videosBaseUrl: string;
    lang: 'en' | 'fr';
} & RouteComponentProps<any>;

type PageListContainerState = {
    pages: IJsonPage[];
    selectedPage?: IJsonPage;
    searchFragment?: string;
};

class PageListContainer extends React.Component<PageListContainerProps, PageListContainerState> {
    readonly state: PageListContainerState;

    constructor(props: PageListContainerProps) {
        super(props);
        this.state = {
            pages: this.props.pageRepository.getAllPages(),
        };
    }

    updateSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.persist();
        const fragment = e.currentTarget.value;
        const pages = this.props.pageRepository.findPages(fragment, this.props.lang);
        this.setState({
            pages: pages,
            searchFragment: fragment,
        });
    };

    openPage = (page: IJsonPage) => {
        const { lang } = this.props;
        this.props.history.push(`/${lang}/page/${page.page_id}`);
    };

    closePage = () => {
        this.setState(
            (prevState): PageListContainerState => ({
                ...prevState,
                selectedPage: undefined,
            })
        );
    };

    render(): JSX.Element {
        const { pages, selectedPage } = this.state;
        const { lang } = this.props;
        const searchBoxStyle = {
            position: 'fixed',
            top: '70px',
            right: '25px',
            width: '150px',
        } as React.CSSProperties;

        return (
            <PageOverlay>
                <PageList
                    baseUrl={this.props.videosBaseUrl}
                    pages={pages}
                    lang={lang}
                    onSelected={page => this.openPage(page)}
                />
                <div style={searchBoxStyle}>
                    <SearchBox onChange={this.updateSearch} />
                </div>
            </PageOverlay>
        );
    }
}

export default withRouter<PageListContainerProps & RouteComponentProps<any>>(PageListContainer);
