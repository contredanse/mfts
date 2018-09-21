import React from 'react';
import './login-form.scss';
import { RouteComponentProps } from 'react-router';
import contredanseLogo from '@assets/images/logo-contredanse.png';

type LoginFormProps = {} & Pick<RouteComponentProps, 'match' | 'history'>;
type LoginFormState = {};

class LoginForm extends React.PureComponent<LoginFormProps, LoginFormState> {
    constructor(props: LoginFormProps) {
        super(props);
    }
    render() {
        const thanks = false;
        const { history, match } = this.props;

        return (
            <div className="login-page-container">
                <div className="login-page">
                    <img src={contredanseLogo} alt="Contredanse logo" />
                    <h2>Please login to your contredanse account !</h2>
                    <p>Here some blah-blah</p>
                    <div className="form">
                        <input type="text" placeholder="Enter email address" />
                        <input type="text" placeholder="My  password" />
                        <button onClick={() => history.push('/')}>Login Now</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginForm;
