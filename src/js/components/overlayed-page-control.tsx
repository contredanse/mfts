import React, { ReactNode, SyntheticEvent } from 'react';

import './overlayed-page-control.scss';
import { ApplicationState } from '@src/store';
import { connect } from 'react-redux';

type Props = {
    onClick?: (e: SyntheticEvent<HTMLDivElement>) => void;
    children: ReactNode;
    extraClasses?: string;
};

type State = {};

const defaultProps = {};

class OverlayedPageControl extends React.PureComponent<Props, State> {
    static defaultProps = defaultProps;
    constructor(props: Props) {
        super(props);
    }

    render() {
        const { onClick, children, extraClasses } = this.props;

        const classes = ['overlayed-page-control-container', extraClasses].join(' ');

        return (
            <div className={classes} onClick={onClick}>
                {children}
            </div>
        );
    }
}

export default OverlayedPageControl;

const mapStateToProps = ({ ui }: ApplicationState) => ({
    extraClasses: ui.isIdleMode ? 'idle-mode' : undefined,
});

export const ConnectedOverlayedPageControl = connect(
    mapStateToProps,
    null
)(OverlayedPageControl);
