import React, { CSSProperties } from 'react';
import { ApplicationState } from '@src/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as uiActions from '@src/store/ui/actions';
import i18n from './fullscreen-button.i18n';

import './fullscreen-button.scss';
import { getFromDictionary } from '@src/i18n/basic-i18n';

import FullscreenExitIcon from 'mdi-react/FullscreenExitIcon';
import FullscreenIcon from 'mdi-react/FullscreenIcon';
import fscreen from 'fscreen';

// Props passed from mapStateToProps
type PropsFromReduxState = {
    isFullscreen: boolean;
};

// Props passed from mapDispatchToProps
type PropsFromReduxDispatchActions = {
    setFullscreen: typeof uiActions.setFullscreen;
};

type FullscreenButtonProps = PropsFromReduxDispatchActions &
    PropsFromReduxState & {
        lang: string;
        style?: CSSProperties;
        className?: string;
    };

const defaultProps = {
    lang: 'en',
    className: 'fullscreen-button',
};

export class FullscreenButton extends React.Component<FullscreenButtonProps> {
    static defaultProps = defaultProps;

    constructor(props: FullscreenButtonProps) {
        super(props);
    }

    toggleFullScreen = () => {
        const { setFullscreen, isFullscreen } = this.props;
        setFullscreen(!isFullscreen);
    };

    render() {
        const { isFullscreen, className, style, lang } = this.props;
        if (!fscreen.fullscreenEnabled) {
            return null;
        }
        return (
            <button
                className={className}
                style={style}
                onClick={this.toggleFullScreen}
                title={isFullscreen ? this.tr('leave_fullscreen') : this.tr('enter_fullscreen')}
            >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </button>
        );
    }

    protected tr = (text: string): string => {
        return getFromDictionary(text, this.props.lang!, i18n);
    };
}

const mapStateToProps = ({ ui }: ApplicationState) => ({
    isFullscreen: ui.fullscreen,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setFullscreen: (isFullscreen: boolean) => dispatch(uiActions.setFullscreen(isFullscreen)),
});

const ConnectedFullscreenButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(FullscreenButton);

export default ConnectedFullscreenButton;
