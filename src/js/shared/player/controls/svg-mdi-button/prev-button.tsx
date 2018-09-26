import React from 'react';
import Button, { ButtonProps } from '../button';
import { SkipPreviousIcon as PreviousIcon } from 'mdi-react';

import './buttons.scss';

export default class PrevButton extends Button {
    static defaultProps: Partial<ButtonProps> = {
        ...Button.defaultProps,
        className: 'PrevButton',
        children: <PreviousIcon size="100%" />,
        isEnabled: false,
    };
}
