import React from 'react';
import Button, { ButtonProps } from '../button';
import { PlayArrowIcon as PlayIcon } from 'mdi-react';

import './buttons.scss';

export default class PlayButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'PlayButton',
        children: <PlayIcon size="100%" />,
        isEnabled: false,
    };
}
