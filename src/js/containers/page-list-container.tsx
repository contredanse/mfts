import React from 'react';
import { PageOverlay } from '@src/components/layout/page-overlay';
import { SearchBox } from '@src/components/search-box';
import { IJsonPage } from '@data/json/data-pages';
import PageList from '@src/components/page-list';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import PageRepository from '@src/models/repository/page-repository';
import memoize from 'memoize-one';
import DocumentMeta from '@src/shared/document-meta';

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

type I18nStatic = { [key: string]: { [key: string]: string } };

const i18n: I18nStatic = {
    page_title: {
        en: 'Page list',
        fr: 'Liste des pages',
    },
};

class PageListContainer extends React.PureComponent<PageListContainerProps, PageListContainerState> {
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

    openPage = (page: IJsonPage) => {
        const { lang } = this.props;
        this.props.history.push(`/${lang}/page/${page.page_id}`);
    };

    render(): JSX.Element {
        const { lang, menuId } = this.props;
        const searchBoxStyle = {
            position: 'fixed',
            top: '70px',
            right: '25px',
            width: '150px',
        } as React.CSSProperties;

        // Calculate the latest filtered list. If these arguments haven't changed
        // since the last render, `memoize-one` will reuse the last return value.
        const filteredList = this.filterPages(this.state.pages, this.state.filterText, this.props.lang);

        const documentTitle = `MFTS >> ${i18n.page_title[lang] || ''}`;

        return (
            <PageOverlay>
                <DocumentMeta title={documentTitle} />
                <PageList
                    baseUrl={this.props.videosBaseUrl}
                    pages={filteredList}
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
