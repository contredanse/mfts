import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import { AuthUser, getUserProfile, logoutUser } from '@src/store/auth/auth';
import { connect } from 'react-redux';
import React from 'react';
import './login-button.scss';
import { RouteComponentProps, withRouter } from 'react-router';

type LoginButtonProps = {
    lang: string;
    handleLogout: () => void;
    handleLoginRequest: () => void;
    afterLogout?: () => void;
    authenticated: boolean;
    user?: AuthUser | null;
    getUserProfile: () => void;
} & RouteComponentProps<{}>;

type LoginButtonState = {};

const defaultProps = {};

export class LoginButton extends React.PureComponent<LoginButtonProps, LoginButtonState> {
    static defaultProps = defaultProps;

    constructor(props: LoginButtonProps) {
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
        const { authenticated, handleLoginRequest } = this.props;
        return (
            <div className="login-button-container">
                {authenticated ? (
                    <button onClick={this.handleLogout}>Logout</button>
                ) : (
                    <button onClick={handleLoginRequest}>Login</button>
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

const ConnectedLoginButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginButton);

export default withRouter(ConnectedLoginButton);
