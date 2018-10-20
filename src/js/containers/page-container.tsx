import React from 'react';
import Page from '@src/components/page';
import NotFoundContainer from '@src/containers/notfound-container';
import { DataSupportedLangType } from '@src/models/repository/data-repository';
import PageProxy from '@src/models/proxy/page-proxy';
import { PageOverlay } from '@src/components/layout/page-overlay';
import PageRepository from '@src/models/repository/page-repository';
import MenuRepository from '@src/models/repository/menu-repository';
import { RouteComponentProps, withRouter } from 'react-router';
import DocumentMeta from '@src/shared/document-meta';

type PageContainerProps = {
    pageId: string;
    lang: DataSupportedLangType;
    pageRepository: PageRepository;
    menuRepository: MenuRepository;
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

    render() {
        const { pageExists, pageProxy } = this.state;

        // should not be required, exit if async loading
        // of pageData is not yet present (see componentDidMount())
        if (pageExists === undefined) {
            return null;
        }

        const { lang } = this.props;

        if (pageProxy) {
            const documentTitle = `MFS >> ${pageProxy.getTitle(lang)}`;

            return (
                <PageOverlay closeButton={false}>
                    <div className="page-wrapper">
                        <DocumentMeta title={documentTitle} />
                        <Page
                            key={pageProxy.pageId}
                            pageProxy={pageProxy}
                            menuRepository={this.props.menuRepository}
                            lang={lang}
                            onPageChangeRequest={this.navigateToPage}
                            onNewRouteRequest={this.navigateToRouteSpec}
                        />
                    </div>
                </PageOverlay>
            );
        } else {
            return <NotFoundContainer />;
        }
    }

    private navigateToRouteSpec = (routeSpec: string): void => {
        const { lang, history } = this.props;
        const newRoute = routeSpec.replace('{lang}', lang);
        history.push(newRoute);
    };

    private navigateToPage = (pageId: string): void => {
        const { lang, history } = this.props;
        history.push(`/${lang}/page/${pageId}`);
    };

    /**
     * @todo find a better way
     */
    private loadPageState(pageId: string) {
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
