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
        const { style, muted, onMute, onUnMute, disableSpaceClick, isEnabled, mediaIsSilent } = this.props;

        return (
            <>
                {muted ? (
                    <SoundOffButton
                        style={style}
                        isEnabled={isEnabled && !mediaIsSilent}
                        onClick={onUnMute}
                        disableSpaceClick={disableSpaceClick}
                    />
                ) : (
                    <SoundOnButton
                        style={style}
                        isEnabled={isEnabled && !mediaIsSilent}
                        onClick={onMute}
                        disableSpaceClick={disableSpaceClick}
                    />
                )}
            </>
        );
    }
}

export default VolumeControl;
