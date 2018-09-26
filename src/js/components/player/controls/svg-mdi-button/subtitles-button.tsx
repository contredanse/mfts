import React from 'react';
import Button, { ButtonProps } from '../button';
import { SubtitlesIcon } from 'mdi-react';

import './buttons.scss';

class SubtitlesButton extends Button {
    static defaultProps: Partial<ButtonProps> = {
        ...Button.defaultProps,
        className: 'SubtitlesButton',
        children: <SubtitlesIcon size="100%" />,
        isEnabled: false,
    };
}

export default SubtitlesButton;
