import React from 'react';
import Button, { ButtonProps } from '../button';
import { VolumeOffIcon as SoundOffIcon } from 'mdi-react';

import './buttons.scss';

export default class SoundOffButton extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        className: 'SoundOffButton',
        children: <SoundOffIcon size="100%" />,
        isEnabled: false,
    };
}
