import React from 'react';
import './login-page.scss';
import { RouteComponentProps } from 'react-router';

import { appConfig } from '@config/config';
import { ExternalUrls } from '@src/core/app-config';
import ConnectedLoginForm from '@src/components/login-form';

export type LoginPageProps = {
    lang?: string;
} & Pick<RouteComponentProps, 'match' | 'history'>;

type LoginPageState = {};

const defaultProps = {
    lang: 'en',
};

export class LoginPage extends React.PureComponent<LoginPageProps, LoginPageState> {
    static defaultProps = defaultProps;

    constructor(props: LoginPageProps) {
        super(props);
    }

    render() {
        const { lang } = this.props;
        return (
            <div className="login-page-container">
                <ConnectedLoginForm lang={lang} match={this.props.match} history={this.props.history} />
            </div>
        );
    }
}

export default LoginPage;
