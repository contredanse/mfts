import React from 'react';
import './page-overlay.scss';

interface IProps {
    closeButton?: boolean;
    onClose?: () => void;
}
interface IState {

}

export class PageOverlay extends React.Component<IProps, IState> {

    public static defaultProps = {
        closeButton: false
    }

    close = (e) => {
        if (this.props.onClose !== undefined) {
            this.props.onClose();
        }
    }

    render() {
        const {closeButton} = this.props;
        return (
            <div className="page-overlay-viewport">
                <div className="page-overlay-ctn">
                    { closeButton === true &&
                        <button className="close-button" onClick={(e) => {
                            this.close(e);
                        }}>
                            X
                        </button>

                    }
                    {this.props.children}
                </div>
            </div>
        );
    }
}
