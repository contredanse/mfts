import React from 'react';
import Button from '../button';
import PauseIcon from 'mdi-react/PauseIcon';

import './buttons.scss';

export default class PauseButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'PauseButton',
        children: <PauseIcon size="100%" />,
        isEnabled: false,
        disableSpaceClick: true,
        tooltip: 'Pause',
    };
}
