import React from 'react';
import { PageOverlay } from '@src/components/layout/page-overlay';
import { SearchBox } from '@src/components/search-box';
import { IJsonPage } from '@data/json/data-pages';
import PageList from '@src/components/page-list';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import PageRepository from '@src/models/repository/page-repository';
import memoize from 'memoize-one';
import DocumentMeta from '@src/utils/document-meta';
import { BasicI18nDictionary, getFromDictionary } from '@src/i18n/basic-i18n';
import equal from 'fast-deep-equal';

type PageListContainerProps = {
    pageRepository: PageRepository;
    videosBaseUrl: string;
    lang: string;
    menuId?: string;
} & RouteComponentProps<any>;

type PageListContainerState = {
    pages: IJsonPage[];
    filterText: string;
    menuId?: string;
};

const i18nDict: BasicI18nDictionary = {
    page_title: {
        en: 'Page list',
        fr: 'Liste des pages',
    },
};

class PageListContainer extends React.Component<PageListContainerProps, PageListContainerState> {
    readonly state: PageListContainerState;

    constructor(props: PageListContainerProps) {
        super(props);
        this.state = {
            //pages: [],
            filterText: '',
            menuId: props.menuId,
            pages: [],
        };
        // Re-rendering performance optimization.
        this.filterPages = memoize(this.filterPages);
    }

    componentDidMount() {
        this.setState({
            pages: this.props.pageRepository.getAllPages(),
        });
    }

    shouldComponentUpdate(nextProps: PageListContainerProps, nextState: PageListContainerState): boolean {
        const props = this.props;
        const state = this.state;
        return (
            nextProps.lang !== props.lang ||
            nextProps.menuId !== props.menuId ||
            nextProps.videosBaseUrl !== props.videosBaseUrl ||
            (nextState.filterText !== state.filterText || nextState.menuId !== state.menuId)
        );
    }

    filterPages = (list: IJsonPage[], filterText: string, lang: string): IJsonPage[] => {
        return this.props.pageRepository.findPages(filterText, lang);
        /*
        return list.filter((page: IJsonPage) => {
            return page.title[lang].includes(filterText) || page.keywords[lang].includes(filterText);
        });*/
    };

    updateSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const fragment = e.currentTarget.value;
        this.setState({
            filterText: fragment,
        });
    };

    openPage = (pageId: string) => {
        const { lang } = this.props;
        this.props.history.push(`/${lang}/page/${pageId}`);
    };

    render(): JSX.Element {
        const { lang, menuId } = this.props;
        const searchBoxStyle = {
            position: 'fixed',
            top: '70px',
            right: '25px',
            width: '150px',
        } as React.CSSProperties;

        console.log('RERENDER PAGELIST');

        // Calculate the latest filtered list. If these arguments haven't changed
        // since the last render, `memoize-one` will reuse the last return value.
        const filteredList = this.filterPages(this.state.pages, this.state.filterText, this.props.lang);

        const documentTitle = `MFS >> ${getFromDictionary('page_title', lang, i18nDict)}`;

        return (
            <PageOverlay>
                <DocumentMeta title={documentTitle} />
                <PageList
                    pageRepository={this.props.pageRepository}
                    baseUrl={this.props.videosBaseUrl}
                    pages={filteredList}
                    lang={lang}
                    onPageClick={this.openPage}
                />
                <div style={searchBoxStyle}>
                    <SearchBox onChange={this.updateSearch} />
                </div>
            </PageOverlay>
        );
    }
}

export default withRouter<PageListContainerProps & RouteComponentProps<any>>(PageListContainer);
