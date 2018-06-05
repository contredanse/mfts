import React from 'react';

import Button, { ButtonProps } from './button';
import { PlayIcon } from '../icons/svg-icons';
import './buttons.scss';

class PlayButton extends Button {
    static defaultProps: Partial<ButtonProps> = {
        ...Button.defaultProps,
        className: 'PlayButton',
        children: <PlayIcon />,
        isEnabled: false,
    };
}

export default PlayButton;
