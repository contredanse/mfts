import React from 'react';
import Button from '../button';
import ReplayIcon from 'mdi-react/ReplayIcon';

import './buttons.scss';

export default class ReplayButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'ReplayButton',
        children: <ReplayIcon size="100%" />,
        isEnabled: false,
        tooltip: 'Replay',
    };
}
