import React from 'react';

import Button, { ButtonProps } from './button';

import { PlayArrowIcon as PlayIcon } from 'mdi-react';

import './buttons.scss';

class PlayButton extends Button {
    static defaultProps: Partial<ButtonProps> = {
        ...Button.defaultProps,
        className: 'PlayButton',
        children: <PlayIcon size="100%" />,
        isEnabled: false,
    };
}

export default PlayButton;
