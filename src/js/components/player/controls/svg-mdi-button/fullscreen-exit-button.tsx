import React from 'react';
import Button from '../button';
import { FullscreenExitIcon } from 'mdi-react';

import './buttons.scss';

export default class FullscreenExitButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'FullscreenExitButton',
        children: <FullscreenExitIcon size="100%" />,
        isEnabled: false,
        tooltip: 'Exit fullscreen',
    };
}
