import React from 'react';
import Button from '../button';
import PlayIcon from 'mdi-react/PlayArrowIcon';

import './buttons.scss';

export default class PlayButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'PlayButton',
        children: <PlayIcon size="100%" />,
        isEnabled: false,
        tooltip: 'Play',
    };
}
