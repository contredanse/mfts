import React from 'react';
import Button from '../button';
import SubtitlesIcon from 'mdi-react/SubtitlesIcon';

import './buttons.scss';

class SubtitlesButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'SubtitlesButton',
        children: <SubtitlesIcon size="100%" />,
        isEnabled: false,
        tooltip: 'Subtitles',
    };
}

export default SubtitlesButton;
