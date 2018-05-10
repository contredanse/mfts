import * as React from 'react';

export type ControlBarProps = {};

export type ControlBarState = {};

export class ControlBar extends React.Component<ControlBarProps, ControlBarState> {
    static defaultProps: Partial<ControlBarProps> = {};

    constructor(props: ControlBarProps) {
        super(props);
    }

    render() {
        return <div>ControlBar Hehehehehe</div>;
    }
}
