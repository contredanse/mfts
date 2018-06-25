import React from 'react';

import Button, { ButtonProps } from './button';
import { SoundOnIcon } from '../icons/svg-icons';
import './buttons.scss';

class SoundOnButton extends Button {
    static defaultProps: Partial<ButtonProps> = {
        ...Button.defaultProps,
        className: 'SoundOnButton',
        children: <SoundOnIcon />,
        isEnabled: false,
    };
}

export default SoundOnButton;
