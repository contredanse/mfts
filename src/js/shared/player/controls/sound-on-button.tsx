import React from 'react';

import Button, { ButtonProps } from './button';
import { VolumeMuteIcon as SoundOnIcon } from 'mdi-react';

import './buttons.scss';

class SoundOnButton extends Button {
    static defaultProps: Partial<ButtonProps> = {
        ...Button.defaultProps,
        className: 'SoundOnButton',
        children: <SoundOnIcon size="100%" />,
        isEnabled: false,
    };
}

export default SoundOnButton;
