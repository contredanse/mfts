import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import { AuthUser, getUserProfile, logoutUser } from '@src/store/auth/auth';
import { connect } from 'react-redux';
import React from 'react';
import './login-menu.scss';

type LoginMenuProps = {
    lang: string;
    handleLogout: () => void;
    handleLoginRequest: () => void;
    authenticated: boolean;
    user?: AuthUser | null;
    getUserProfile: () => void;
};

type LoginMenuState = {};

const defaultProps = {};

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
    };

    render() {
        const { authenticated, user, handleLoginRequest } = this.props;
        return (
            <div className="login-menu-item-container">
                {authenticated ? (
                    <div>
                        <h2>Connected</h2>
                        <div>{user && user.email}</div>
                        <div>
                            <button onClick={this.handleLogout}>Logout</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <button onClick={handleLoginRequest}>Login</button>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = ({ auth }: ApplicationState) => ({
    //authError: auth.authError,
    //loading: auth.loading,
    user: auth.user,
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
