import React from 'react';
import Button, { ButtonProps } from '../button';
import { VolumeHighIcon as SoundOnIcon } from 'mdi-react';

import './buttons.scss';

export default class SoundOnButton extends Button {
    static defaultProps: Partial<ButtonProps> = {
        ...Button.defaultProps,
        className: 'SoundOnButton',
        children: <SoundOnIcon size="100%" />,
        isEnabled: false,
    };
}
