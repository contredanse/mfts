import React from 'react';

import Button, { ButtonProps } from './button';
import { PreviousIcon } from '../icons/svg-icons';

class PrevButton extends Button {
    static defaultProps: Partial<ButtonProps> = {
        ...Button.defaultProps,
        className: 'PrevButton',
        children: <PreviousIcon />,
        isEnabled: false,
    };
}

export default PrevButton;
