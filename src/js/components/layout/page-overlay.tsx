import React from 'react';

import './page-overlay.scss';
import { CustomScrollbar } from '@src/components/layout/custom-scrollbar';

type PageOverlayProps = {
    closeButton?: boolean;
    onClose?: () => void;
    fullHeight?: boolean;
};
type PageOverlayState = {};

const defaultProps = {
    closeButton: false,
    fullHeight: false,
};

export class PageOverlay extends React.PureComponent<PageOverlayProps, PageOverlayState> {
    static defaultProps = defaultProps;
    render() {
        const { closeButton, fullHeight } = this.props;

        const extraCls = fullHeight ? ' full-height' : '';

        return (
            <div className={'page-overlay-viewport' + extraCls}>
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
                    <CustomScrollbar>{this.props.children}</CustomScrollbar>
                </div>
            </div>
        );
    }
    protected handleClose = (e: React.MouseEvent<HTMLElement>) => {
        if (this.props.onClose !== undefined) {
            this.props.onClose();
        }
    };
}
