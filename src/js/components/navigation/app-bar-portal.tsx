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

    render() {
        const { children, container } = this.props;
        const domNode = document.getElementById(container!);

        if (!domNode) {
            console.warn(`Cannot mount appbarportal, container ${container} is not in the dom`);
            return null;
        }

        return createPortal(children, domNode);
    }
}
