import React from 'react';
import Button, { ButtonProps } from '../button';
import { SubtitlesIcon, SubtitlesOutlineIcon } from 'mdi-react';

import './buttons.scss';

class SubtitlesButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'SubtitlesButton',
        children: <SubtitlesIcon size="100%" />,
        isEnabled: false,
    };
}

export default SubtitlesButton;
