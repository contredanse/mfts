import React from 'react';

import Button, { ButtonProps } from './button';

import { PauseIcon } from 'mdi-react';

class PauseButton extends Button {
    static defaultProps: Partial<ButtonProps> = {
        ...Button.defaultProps,
        className: 'PauseButton',
        children: <PauseIcon size="100%" />,
        isEnabled: false,
    };
}

export default PauseButton;
