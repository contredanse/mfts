import React from 'react';
import Button, { ButtonProps } from '../button';
import { PauseIcon } from 'mdi-react';

import './buttons.scss';

export default class PauseButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'PauseButton',
        children: <PauseIcon size="100%" />,
        isEnabled: false,
        disableSpaceClick: true,
    };
}
