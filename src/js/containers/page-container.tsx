import React from 'react';
import Page from '@src/components/page';
import NotFoundContainer from '@src/containers/notfound-container';
import { DataSupportedLangType } from '@src/models/repository/data-repository';
import PageProxy from '@src/models/proxy/page-proxy';
import { PageOverlay } from '@src/components/layout/page-overlay';
import PageRepository from '@src/models/repository/page-repository';
import MenuRepository, { MenuSectionProps, PrevAndNextPageEntities } from '@src/models/repository/menu-repository';
import { RouteComponentProps, withRouter } from 'react-router';
import DocumentMeta from '@src/shared/document-meta';

type PageContainerProps = {
    pageId: string;
    lang: DataSupportedLangType;
    pageRepository: PageRepository;
    menuRepository?: MenuRepository;
} & RouteComponentProps<any>;

type PageContainerState = {
    pageExists: boolean | undefined;
    pageProxy: PageProxy | undefined;
};

class PageContainer extends React.Component<PageContainerProps, PageContainerState> {
    readonly state: PageContainerState = {
        pageExists: undefined,
        pageProxy: undefined,
    };

    constructor(props: PageContainerProps) {
        super(props);
    }

    componentDidMount() {
        this.loadPageState(this.props.pageId);
    }

    componentDidUpdate(prevProps: PageContainerProps, prevState: PageContainerState) {
        if (this.props.pageId !== prevProps.pageId) {
            this.loadPageState(this.props.pageId);
        }
    }

    getPrevAndNextPageEntities(pageId: string): PrevAndNextPageEntities {
        const { menuRepository } = this.props;
        if (menuRepository === undefined) {
            return {};
        }
        return menuRepository.getPrevAndNextPageEntityMenu(pageId, this.props.lang, this.props.pageRepository);
    }

    getMenuBreadcrumb(pageId: string): MenuSectionProps[] {
        const { menuRepository } = this.props;
        if (menuRepository === undefined) {
            return [];
        }
        return menuRepository.getPageBreadcrumb(pageId, this.props.lang);
    }

    navigateToPage = (pageId: string): void => {
        const { lang } = this.props;
        this.loadPageState(pageId);
        this.props.history.push(`/${lang}/page/${pageId}`);
    };

    render() {
        const { pageExists, pageProxy } = this.state;

        // should not be required, exit if async loading
        // of pageData is not yet present (see componentDidMount())
        if (pageExists === undefined) {
            return null;
        }

        const { lang } = this.props;

        if (pageProxy) {
            const { previousPage, nextPage } = this.getPrevAndNextPageEntities(this.props.pageId);
            const breadcrumb = this.getMenuBreadcrumb(this.props.pageId);
            const documentTitle = `MFTS >> ${pageProxy.getTitle(lang)}`;
            return (
                <PageOverlay closeButton={false}>
                    <div className="page-wrapper">
                        <DocumentMeta title={documentTitle} />
                        <Page
                            pageProxy={pageProxy}
                            menuBreadcrumb={breadcrumb}
                            lang={lang}
                            previousPage={previousPage}
                            nextPage={nextPage}
                            // onPageChangeRequest={() => {this.props.history.push('/about')}}
                            onPageChangeRequest={this.navigateToPage}
                        />
                    </div>
                </PageOverlay>
            );
        } else {
            return <NotFoundContainer />;
        }
    }

    /**
     * @todo find a better way
     */
    protected loadPageState(pageId: string) {
        try {
            const pageProxy = this.props.pageRepository.getPageProxy(this.props.pageId);
            this.setState(
                (prevState: PageContainerState): PageContainerState => {
                    return {
                        ...prevState,
                        pageExists: true,
                        pageProxy: pageProxy,
                    };
                }
            );
        } catch (e) {
            this.setState(
                (prevState: PageContainerState): PageContainerState => {
                    return {
                        ...prevState,
                        pageExists: false,
                        pageProxy: undefined,
                    };
                }
            );
        }
    }
}

export default withRouter(PageContainer);
