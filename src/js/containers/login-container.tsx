import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { LoginLayout } from '@src/components/layout/login-layout';
import ConnectedLoginForm from '@src/components/login-form';
import { ApplicationState } from '@src/store';
import { AuthUser } from '@src/store/auth/auth';
import { connect } from 'react-redux';
import ConnectedProfileContainer from '@src/containers/profile-container';

type LoginContainerProps = {
    user?: AuthUser | null;
    lang: string;
    authenticated: boolean;
} & RouteComponentProps<{}>;
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
            return <ConnectedProfileContainer lang={lang} />;
        }
        return (
            <LoginLayout>
                <ConnectedLoginForm match={this.props.match} history={this.props.history} />
            </LoginLayout>
        );
    }
}

const mapStateToProps = ({ auth }: ApplicationState) => ({
    user: auth.user,
    authenticated: auth.authenticated,
});

const ConnectedLoginContainer = withRouter(
    connect(
        mapStateToProps,
        null
    )(LoginContainer)
);

export default ConnectedLoginContainer;
