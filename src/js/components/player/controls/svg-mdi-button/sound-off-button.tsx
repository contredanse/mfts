import React from 'react';
import Button from '../button';
import VolumeOffIcon from 'mdi-react/VolumeOffIcon';

import './buttons.scss';

export default class SoundOffButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'SoundOffButton',
        children: <VolumeOffIcon size="100%" />,
        isEnabled: false,
        tooltip: 'Unmute',
    };
}
