import React, { Component, useRef } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { LoginLayout } from '@src/components/layout/login-layout';
import ConnectedLoginForm, { LoginForm, LoginFormProps } from '@src/components/login-form';
import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import { AuthUser, loginUser } from '@src/store/auth/auth';
import { connect } from 'react-redux';

type ProfileContainerProps = {
    lang: string;
    user?: AuthUser | null;
    authenticated: boolean;
} & RouteComponentProps<{}>;
type ProfileContainerState = {};

const defaultProps = {};

class ProfileContainer extends Component<ProfileContainerProps, ProfileContainerState> {
    static defaultProps = defaultProps;
    constructor(props: ProfileContainerProps) {
        super(props);
    }

    componentDidMount(): void {
        const { authenticated, user, lang } = this.props;
        if (!authenticated) {
            this.props.history.push(`/${lang}/login`);
        }
    }

    render() {
        const { authenticated, user } = this.props;
        if (!authenticated) {
            //alert('cool');
            return null;
        }
        return (
            <LoginLayout>
                <div className="login-page-container">
                    <div className="profile-page-container">
                        <div>Authenticated ;)</div>
                        <div>Profile page</div>
                        <div>User: {user ? user.email : 'unknown'}</div>
                    </div>
                </div>
                }
            </LoginLayout>
        );
    }
}

const mapStateToProps = ({ auth }: ApplicationState) => ({
    user: auth.user,
    authenticated: auth.authenticated,
});

const ConnectedProfileContainer = withRouter(
    connect(
        mapStateToProps,
        null
    )(ProfileContainer)
);

export default ConnectedProfileContainer;
