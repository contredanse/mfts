import React, { ReactNode, SyntheticEvent } from 'react';

import './overlayed-page-btn.scss';

type Props = {
    onClick?: (e: SyntheticEvent<HTMLDivElement>) => void;
    children: ReactNode;
    extraClasses?: string;
};

type State = {};

const defaultProps = {};

class OverlayedPageBtn extends React.PureComponent<Props, State> {
    static defaultProps = defaultProps;
    constructor(props: Props) {
        super(props);
    }

    render() {
        const { onClick, children, extraClasses } = this.props;

        const classes = ['overlayed-page-btn-container', extraClasses].join(' ');

        return (
            <div className={classes} onClick={onClick}>
                {children}
            </div>
        );
    }
}

export default OverlayedPageBtn;
