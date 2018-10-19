import React, { PureComponent, CSSProperties } from 'react';
import { SoundOffButton, SoundOnButton } from '@src/components/player/controls/svg-mdi-button';

export type VolumeControlProps = {
    muted: boolean;
    volume: number;
    mediaIsSilent?: boolean;
    onUnMute: () => void;
    onMute: () => void;
    disableSpaceClick?: boolean;
    isEnabled?: boolean;
    style?: CSSProperties;
    tooltips?: {
        mute: string;
        unmute: string;
    };
};

const defaultProps = {
    isEnabled: true,
    disableSpaceClick: false,
    mediaIsSilent: false,
    style: {},
};

class VolumeControl extends PureComponent<VolumeControlProps> {
    static defaultProps = defaultProps;

    render() {
        const { style, muted, onMute, onUnMute, disableSpaceClick, isEnabled, mediaIsSilent, tooltips } = this.props;

        let tooltipAttr = {};
        if (tooltips) {
            const tooltipText = muted ? tooltips.unmute : tooltips.mute;
            tooltipAttr = { tooltip: tooltipText };
        }

        return (
            <>
                {muted ? (
                    <SoundOffButton
                        style={style}
                        isEnabled={isEnabled && !mediaIsSilent}
                        onClick={onUnMute}
                        disableSpaceClick={disableSpaceClick}
                        {...tooltipAttr}
                    />
                ) : (
                    <SoundOnButton
                        style={style}
                        isEnabled={isEnabled && !mediaIsSilent}
                        onClick={onMute}
                        disableSpaceClick={disableSpaceClick}
                        {...tooltipAttr}
                    />
                )}
            </>
        );
    }
}

export default VolumeControl;
