import React from 'react';
import Page from '@src/components/page';
import NotFoundContainer from '@src/containers/notfound-container';
import { DataSupportedLangType } from '@src/models/repository/data-repository';
import PageProxy from '@src/models/proxy/page-proxy';
import { PageOverlay } from '@src/components/layout/page-overlay';
import PageRepository from '@src/models/repository/page-repository';
import MenuRepository from '@src/models/repository/menu-repository';
import { RouteComponentProps, withRouter } from 'react-router';
import DocumentMeta from '@src/utils/document-meta';
import { Dispatch } from 'redux';
import { NavBreadcrumbProps } from '@src/store/nav';
import * as navActions from '@src/store/nav/actions';
import { connect } from 'react-redux';
import { throttle } from 'throttle-debounce';

type PageContainerProps = {
    pageId: string;
    lang: DataSupportedLangType;
    pageRepository: PageRepository;
    menuRepository: MenuRepository;
    setPageBreadcrumb?: (breadcrumb?: NavBreadcrumbProps) => void;
    authTimeoutCheck?: number;
} & RouteComponentProps<any>;

type PageContainerState = {
    pageProxy: PageProxy | undefined;
};

const tenSeconds = 1e4;

const defaultProps = {
    authTimeoutCheck: tenSeconds,
};

class PageContainer extends React.PureComponent<PageContainerProps, PageContainerState> {
    static defaultProps = defaultProps;

    readonly state: PageContainerState = {
        pageProxy: undefined,
    };

    authTimeoutHandle?: number;
    isAuthTimeoutCancelled = false;

    constructor(props: PageContainerProps) {
        super(props);
        this.state = this.getStateFromPageId(props.pageId);
    }

    redirectIfNotAuthenticacted(pageId: string) {
        this.props.history.push(`/${this.props.lang}/welcome/${pageId}`);
    }

    componentDidMount() {
        this.createAuthTimeout();
        this.setNavigationBreadcrumb(this.state.pageProxy);
    }

    componentWillUnmount() {
        this.clearAuthTimeout();
        this.setNavigationBreadcrumb(undefined);
    }

    componentDidUpdate(prevProps: PageContainerProps, prevState: PageContainerState) {
        if (this.props.pageId !== prevProps.pageId) {
            this.createAuthTimeout();
            this.setState(() => {
                const newState = this.getStateFromPageId(this.props.pageId);
                this.setNavigationBreadcrumb(newState.pageProxy);
                return newState;
            });
        }
    }

    render() {
        const { pageProxy } = this.state;
        const { lang } = this.props;

        if (pageProxy) {
            const documentTitle = `MFS >> ${pageProxy.getTitle(lang)}`;
            return (
                <PageOverlay closeButton={false}>
                    <div className="page-wrapper">
                        <DocumentMeta title={documentTitle} />
                        <Page
                            // Note the key here... Yes it's forcing the
                            // update of the entire page. Got too much issues
                            // with videoPlayer. To be safe: force update
                            key={pageProxy.pageId}
                            lang={lang}
                            pageProxy={pageProxy}
                            menuRepository={this.props.menuRepository}
                            onNewRouteRequest={this.navigateToRouteSpec}
                        />
                    </div>
                </PageOverlay>
            );
        } else {
            return <NotFoundContainer />;
        }
    }

    private setNavigationBreadcrumb(pageProxy?: PageProxy): void {
        const { setPageBreadcrumb, lang } = this.props;
        if (setPageBreadcrumb) {
            const bc = pageProxy
                ? {
                      title: pageProxy.getTitle(lang),
                  }
                : undefined;
            setPageBreadcrumb(bc);
        }
    }

    private getStateFromPageId(pageId: string): Pick<PageContainerState, 'pageProxy'> {
        const pageProxy = this.props.pageRepository.getPageProxy(this.props.pageId);
        if (pageProxy) {
            return {
                pageProxy: pageProxy,
            };
        } else {
            return {
                pageProxy: undefined,
            };
        }
    }

    private navigateToRouteSpec = (routeSpec?: string): void => {
        const { lang, history } = this.props;
        if (routeSpec) {
            const newRoute = routeSpec.replace('{lang}', lang);
            history.push(newRoute);
        }
    };

    private navigateToPage = (pageId: string): void => {
        const { lang, history } = this.props;
        history.push(`/${lang}/page/${pageId}`);
    };

    private clearAuthTimeout(): void {
        this.isAuthTimeoutCancelled = true;
        if (this.authTimeoutHandle) {
            clearTimeout(this.authTimeoutHandle);
        }
    }

    private createAuthTimeout(): void {
        this.clearAuthTimeout();
        // typescript does not resolve correct
        // setTimeout version between node/browser
        this.authTimeoutHandle = setTimeout(() => {
            if (!this.isAuthTimeoutCancelled) {
                this.redirectIfNotAuthenticacted(this.props.pageId);
            }
        }, this.props.authTimeoutCheck) as any;
        this.isAuthTimeoutCancelled = false;
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setPageBreadcrumb: (breadcrumb?: NavBreadcrumbProps) => dispatch(navActions.setPageBreadcrumb(breadcrumb)),
});

export default withRouter(
    connect(
        null,
        mapDispatchToProps
    )(PageContainer)
);
