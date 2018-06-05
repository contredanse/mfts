import React from 'react';

import Button, { ButtonProps } from './button';
import { PauseIcon } from '../icons/svg-icons';

class PauseButton extends Button {
    static defaultProps: Partial<ButtonProps> = {
        ...Button.defaultProps,
        className: 'PauseButton',
        children: <PauseIcon />,
        isEnabled: false,
    };
}

export default PauseButton;
