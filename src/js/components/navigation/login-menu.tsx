import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import { AuthUser, logoutUser } from '@src/store/auth/auth';
import { connect } from 'react-redux';
import React from 'react';

type LoginMenuProps = {
    handleLogout: () => void;
    authenticated: boolean;
    user?: AuthUser | null;
};

type LoginMenuState = {};

const defaultProps = {};

export class LoginMenu extends React.PureComponent<LoginMenuProps, LoginMenuState> {
    static defaultProps = defaultProps;

    constructor(props: LoginMenuProps) {
        super(props);
    }

    render() {
        const { authenticated, user } = this.props;
        return (
            <div>
                {authenticated ? (
                    <div>
                        <div>{user && user.email}</div>
                        <div>Logout</div>
                    </div>
                ) : (
                    <div>Login</div>
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
    handleLogout: () => logoutUser(),
});

const ConnectedLoginMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginMenu);

export default ConnectedLoginMenu;
