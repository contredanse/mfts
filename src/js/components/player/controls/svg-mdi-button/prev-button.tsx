import React from 'react';
import Button from '../button';
import { SkipPreviousIcon as PreviousIcon } from 'mdi-react';

import './buttons.scss';

export default class PrevButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'PrevButton',
        children: <PreviousIcon size="100%" />,
        isEnabled: false,
        tooltip: 'Previous',
    };
}
