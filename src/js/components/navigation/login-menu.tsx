import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import { AuthUser, getUserProfile, logoutUser } from '@src/store/auth/auth';
import { connect } from 'react-redux';
import i18n from './login-menu.i18n';
import React from 'react';
import './login-menu.scss';
import { getFromDictionary } from '@src/i18n/basic-i18n';

type LoginMenuProps = {
    lang: string;
    handleLogout: () => void;
    handleLoginRequest: () => void;
    afterLogout?: () => void;
    authenticated: boolean;
    user?: AuthUser | null;
    getUserProfile: () => void;
    loading: boolean;
};

type LoginMenuState = {};

const defaultProps = {
    loading: false,
};

export class LoginMenu extends React.PureComponent<LoginMenuProps, LoginMenuState> {
    static defaultProps = defaultProps;

    constructor(props: LoginMenuProps) {
        super(props);
    }

    async componentDidMount() {
        if (this.props.authenticated && !this.props.user) {
            this.props.getUserProfile();
        }
    }

    handleLogout = () => {
        this.props.handleLogout();
        if (this.props.afterLogout) {
            this.props.afterLogout();
        }
    };

    render() {
        const { authenticated, user, handleLoginRequest, loading } = this.props;
        if (loading) {
            return null;
        }
        return (
            <div className="login-menu-item-container">
                {authenticated ? (
                    <div className="unauthenticated-container">
                        <div className="welcome">{this.tr('welcome')}</div>
                        <div className="user_email">{user && user.email}</div>
                        <div>
                            <button onClick={this.handleLogout}>{this.tr('logout')}</button>
                        </div>
                    </div>
                ) : (
                    <div className="unauthenticated-container">
                        <div>
                            <button onClick={handleLoginRequest}>{this.tr('login')}</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    private tr = (text: string): string => {
        return getFromDictionary(text, this.props.lang!, i18n);
    };
}

const mapStateToProps = ({ auth }: ApplicationState) => ({
    user: auth.user,
    loading: auth.loading,
    authenticated: auth.authenticated,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    handleLogout: () => dispatch(logoutUser()),
    getUserProfile: () => getUserProfile()(dispatch),
});

const ConnectedLoginMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginMenu);

export default ConnectedLoginMenu;
