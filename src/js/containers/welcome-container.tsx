import React from 'react';
import { DataSupportedLangType } from '@src/models/repository/data-repository';
import { PageOverlay } from '@src/components/layout/page-overlay';
import PageRepository from '@src/models/repository/page-repository';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import DocumentMeta from '@src/utils/document-meta';
import Welcome from '@src/components/welcome';
import { ApplicationState } from '@src/store';
import { connect } from 'react-redux';
import { AuthUser } from '@src/store/auth/auth';
import { getMainMenuRoute } from '@src/helpers/main-menu-redirect';

type WelcomeContainerProps = {
    lang?: DataSupportedLangType;
    pageRepository: PageRepository;
    fromPageId?: string;
    user?: AuthUser | null;
    authenticated: boolean;
} & RouteComponentProps<any>;

type WelcomeContainerState = {};

const defaultState = {};

const defaultProps = {
    lang: 'en',
    authenticated: false,
};

class WelcomeContainer extends React.PureComponent<WelcomeContainerProps, WelcomeContainerState> {
    static defaultProps = defaultProps;

    readonly state: WelcomeContainerState;

    constructor(props: WelcomeContainerProps) {
        super(props);
        this.state = defaultState;
    }

    handleLoginSuccess = () => {
        const { fromPageId } = this.props;
        const { lang, history } = this.props;

        if (fromPageId) {
            const pageId = fromPageId;
            history.push(`/${lang}/page/${pageId}`);
        } else {
            // redirect to helix/search page
            history.push(getMainMenuRoute(lang!));
        }
    };

    render() {
        const { lang, pageRepository, fromPageId, authenticated } = this.props;

        return authenticated ? (
            fromPageId ? (
                <Redirect to={`/${lang}/page/${fromPageId}`} />
            ) : (
                <Redirect to={`/${getMainMenuRoute(lang!)}`} />
            )
        ) : (
            <PageOverlay fullHeight={true} closeButton={false}>
                <DocumentMeta title={'Material for the spine - Welcome'} />
                <Welcome
                    pageRepository={pageRepository}
                    lang={lang}
                    fromPageId={fromPageId}
                    handleLoginSuccess={this.handleLoginSuccess}
                />
            </PageOverlay>
        );
    }
}

const mapStateToProps = ({ auth }: ApplicationState) => ({
    user: auth.user,
    authenticated: auth.authenticated,
});

const ConnectedWelcomeContainer = connect(
    mapStateToProps,
    null
)(WelcomeContainer);

export default withRouter(ConnectedWelcomeContainer);
