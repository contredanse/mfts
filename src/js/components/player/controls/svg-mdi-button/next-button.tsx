import React from 'react';
import Button, { ButtonProps } from '../button';
import { SkipNextIcon as NextIcon } from 'mdi-react';

import './buttons.scss';

export default class NextButton extends Button {
    static defaultProps: ButtonProps = {
        ...Button.defaultProps,
        className: 'NextButton',
        children: <NextIcon size="100%" />,
        isEnabled: false,
    };
}
