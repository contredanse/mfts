import React from 'react';
import Button from '../button';
import FullscreenIcon from 'mdi-react/FullscreenIcon';

import './buttons.scss';

export default class FullscreenButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'FullscreenButton',
        children: <FullscreenIcon size="100%" />,
        isEnabled: false,
        tooltip: 'Fullscreen',
    };
}
