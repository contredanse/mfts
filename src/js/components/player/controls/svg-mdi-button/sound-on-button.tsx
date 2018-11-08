import React from 'react';
import Button from '../button';
import VolumeHighIcon from 'mdi-react/VolumeHighIcon';

import './buttons.scss';

export default class SoundOnButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'SoundOnButton',
        children: <VolumeHighIcon size="100%" />,
        isEnabled: false,
        tooltip: 'Mute',
    };
}
