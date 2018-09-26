import React, { MouseEvent } from 'react';

import './control-bar-overlay.scss';

type ControlBarOverlayState = {
    isActive: boolean;
};
type ControlBarOverlayProps = {};

const defaultProps = {} as ControlBarOverlayProps;

export class ControlBarOverlay extends React.Component<ControlBarOverlayProps, ControlBarOverlayState> {
    static readonly defaultProps = defaultProps;
    readonly state: ControlBarOverlayState;

    constructor(props: ControlBarOverlayProps) {
        super(props);
        this.state = {
            isActive: false,
        };
    }

    handleEnableHover = (e: MouseEvent<HTMLDivElement>): void => {
        this.setState({
            isActive: true,
        });
    };

    handleDisableHover = (e: MouseEvent<HTMLDivElement>): void => {
        this.setState({
            isActive: false,
        });
    };

    render() {
        const { children } = this.props;
        const { isActive } = this.state;
        return (
            <div
                className={'control-bar-ctn' + (isActive ? ' control-bar-ctn--active' : '')}
                onMouseOver={this.handleEnableHover}
                onMouseOut={this.handleDisableHover}
            />
        );
    }
}

export default ControlBarOverlay;
