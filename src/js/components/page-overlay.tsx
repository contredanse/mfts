import React from 'react';
import Scrollbars from 'react-custom-scrollbars';

import './page-overlay.scss';

type PageOverlayProps = {
    closeButton?: boolean;
    onClose?: () => void;
};
type PageOverlayState = {};

export class PageOverlay extends React.Component<PageOverlayProps, PageOverlayState> {
    protected static defaultProps = {
        closeButton: false,
    };

    protected handleClose = e => {
        if (this.props.onClose !== undefined) {
            this.props.onClose();
        }
    };

    protected getScrollbarTrack(): React.StatelessComponent<any> {
        const trackStyle = {
            width: '5px',
            borderRadius: 3,
            top: '10%',
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

    render() {
        const { closeButton } = this.props;

        return (
            <div className="page-overlay-viewport">
                <div className="page-overlay-ctn">
                    {closeButton === true && (
                        <div className="top-bar">
                            <button
                                className="close-button"
                                onClick={e => {
                                    this.handleClose(e);
                                }}
                            >
                                X
                            </button>
                        </div>
                    )}
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
                </div>
            </div>
        );
    }
}
