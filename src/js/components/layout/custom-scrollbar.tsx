import React from 'react';
import Scrollbars from 'react-custom-scrollbars';

import './page-overlay.scss';

type CustomScrollbarProps = {
    closeButton?: boolean;
    onClose?: () => void;
};
type CustomScrollbarState = {};

const defaultProps = {};

export class CustomScrollbar extends React.PureComponent<CustomScrollbarProps, CustomScrollbarState> {
    static defaultProps: CustomScrollbarProps = defaultProps;

    constructor(props: CustomScrollbarProps) {
        super(props);
    }

    render() {
        return (
            <Scrollbars
                autoHide={false}
                autoHideDuration={5000}
                hideTracksWhenNotNeeded={true}
                style={{}}
                renderThumbVertical={this.getScrollbarThumb()}
                renderTrackVertical={this.getScrollbarTrack()}
            >
                {this.props.children}
            </Scrollbars>
        );
    }

    protected getScrollbarTrack(): React.StatelessComponent<any> {
        const trackStyle = {
            width: '5px',
            borderRadius: 3,
            top: '5%',
            bottom: '10%',
            right: '10px',
            borderRight: '2px dotted rgba(255,255,255, 0.5)',
        };
        return ({ style, ...props }) => <div style={{ ...style, ...trackStyle }} {...props} />;
    }

    protected getScrollbarThumb(): React.StatelessComponent<any> {
        const thumbStyle = {
            backgroundColor: 'rgba(255,255,255, 0.7)',
            cursor: 'pointer',
            borderRadius: 'inherit',
        };
        return ({ style, props }) => <div style={{ ...style, ...thumbStyle }} {...props} />;
    }
}
