import React from 'react';

import Button, { ButtonProps } from './button';
import { NextIcon } from '../icons/svg-icons';

class NextButton extends Button {
    static defaultProps: Partial<ButtonProps> = {
        ...Button.defaultProps,
        className: 'NextButton',
        children: <NextIcon />,
        isEnabled: false,
    };
}

export default NextButton;
