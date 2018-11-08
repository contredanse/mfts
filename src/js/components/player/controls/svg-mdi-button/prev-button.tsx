import React from 'react';
import Button from '../button';
import SkipPreviousIcon from 'mdi-react/SkipPreviousIcon';

import './buttons.scss';

export default class PrevButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'PrevButton',
        children: <SkipPreviousIcon size="100%" />,
        isEnabled: false,
        tooltip: 'Previous',
    };
}
