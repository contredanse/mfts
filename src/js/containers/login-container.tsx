import React, { Component } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { LoginLayout } from '@src/components/layout/login-layout';
import { ApplicationState } from '@src/store';
import { AuthUser } from '@src/store/auth/auth';
import { connect } from 'react-redux';
import { getMainMenuRoute } from '@src/helpers/main-menu-redirect';
import LoginPage from '@src/components/login-page';

type LoginContainerProps = {
    user?: AuthUser | null;
    lang: string;
    authenticated: boolean;
};

type LoginContainerState = {};

const defaultProps = {};

class LoginContainer extends Component<LoginContainerProps, LoginContainerState> {
    static defaultProps = defaultProps;
    constructor(props: LoginContainerProps) {
        super(props);
    }

    render() {
        const { authenticated, user, lang } = this.props;
        if (authenticated) {
            return (
                <LoginLayout>
                    <div className="login-page-container">
                        <div className="profile-page-container">
                            <div>Authenticated ;)</div>
                            <div>Profile page</div>
                            <div>User: {user ? user.email : 'unknown'}</div>
                        </div>
                    </div>
                </LoginLayout>
            );
        }
        return (
            <LoginLayout>
                <LoginPage lang={lang} />
            </LoginLayout>
        );
    }
}

const mapStateToProps = ({ auth }: ApplicationState) => ({
    user: auth.user,
    authenticated: auth.authenticated,
});

const ConnectedLoginContainer = connect(
    mapStateToProps,
    null
)(LoginContainer);

export default ConnectedLoginContainer;
