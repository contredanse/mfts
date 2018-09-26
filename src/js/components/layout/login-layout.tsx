import React from 'react';

import './login-layout.scss';

type LoginLayoutProps = {};
type LoginLayoutState = {};

const defaultProps = {};

export class LoginLayout extends React.Component<LoginLayoutProps, LoginLayoutState> {
    static defaultProps: Partial<LoginLayoutProps> = defaultProps;
    render() {
        return <div className="login-layout-container">{this.props.children}</div>;
    }
}
