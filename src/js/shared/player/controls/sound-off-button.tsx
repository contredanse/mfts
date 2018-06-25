import React from 'react';

import Button, { ButtonProps } from './button';
import { SoundOffIcon } from '../icons/svg-icons';
import './buttons.scss';

class SoundOffButton extends Button {
    static defaultProps: Partial<ButtonProps> = {
        ...Button.defaultProps,
        className: 'SoundOffButton',
        children: <SoundOffIcon />,
        isEnabled: false,
    };
}

export default SoundOffButton;
