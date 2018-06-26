import React from 'react';

import Button, { ButtonProps } from './button';
import { SkipNextIcon as NextIcon } from 'mdi-react';

class NextButton extends Button {
    static defaultProps: Partial<ButtonProps> = {
        ...Button.defaultProps,
        className: 'NextButton',
        children: <NextIcon size="100%" />,
        isEnabled: false,
    };
}

export default NextButton;
