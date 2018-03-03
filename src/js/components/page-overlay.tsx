import React from 'react';
import Scrollbars from 'react-custom-scrollbars';

import './page-overlay.scss';

interface IProps {
    closeButton?: boolean;
    onClose?: () => void;
}
interface IState {

}

export class PageOverlay extends React.Component<IProps, IState> {

    public static defaultProps = {
        closeButton: false,
    };

    close = (e) => {
        if (this.props.onClose !== undefined) {
            this.props.onClose();
        }
    }

    renderThumb = ({ style, ...props }) => {

        const thumbStyle = {
            backgroundColor: 'rgba(255,255,255, 0.7)',
            cursor: 'pointer',
            borderRadius: 'inherit',
        };
        return (
            <div style={{ ...style, ...thumbStyle }} {...props} />
        );
    }

    renderTrack = ({ style, ...props }) => {

        const trackStyle = {
            width: '5px',
            //backgroundColor: 'yellow',
            borderRadius: 3,
            top: '10%',
            bottom: '5px',
            right: '10px',
            borderRight: '1px dotted rgba(255,255,255, 0.5)',
        };
        return (
            <div style={{ ...style, ...trackStyle }} {...props} />
        );
    }

    render() {
        const {closeButton} = this.props;
        return (
            <div className="page-overlay-viewport">
                <div className="page-overlay-ctn">
                    <div className="top-bar">
                    { closeButton === true &&
                        <button className="close-button" onClick={(e) => {
                            this.close(e);
                        }}>
                            X
                        </button>
                    }
                    </div>
                    <Scrollbars
                        autoHide={false}
                        autoHideDuration={5000}
                        hideTracksWhenNotNeeded={true}
                        style={{ height: '100%' }}
                        renderThumbVertical={this.renderThumb}
                        renderTrackVertical={this.renderTrack}>
                        {this.props.children}
                    </Scrollbars>
                </div>
            </div>
        );
    }
}
