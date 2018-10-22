import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';

type AppBarPortalProps = {
    children: ReactNode;
    container?: string;
};

const defaultProps = {
    container: 'app-bar-portal-ctn',
};

export default class AppBarPortal extends React.PureComponent<AppBarPortalProps, {}> {
    static defaultProps = defaultProps;

    el: HTMLDivElement;

    constructor(props: AppBarPortalProps) {
        super(props);
        this.el = document.createElement('div');
    }

    componentDidMount() {
        const { container } = this.props;
        const domNode = document.getElementById(container!);
        if (domNode) {
            domNode.appendChild(this.el);
        } else {
            console.warn(`Cannot mount appbarportal, container ${container} is not in the dom`);
        }
    }

    componentWillUnmount() {
        const { container } = this.props;
        const domNode = document.getElementById(container!);
        if (domNode) {
            domNode.removeChild(this.el);
        }
    }

    render() {
        const { children, container } = this.props;
        return createPortal(children, this.el);
    }
}
