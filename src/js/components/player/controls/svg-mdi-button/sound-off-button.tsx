import React from 'react';
import Button from '../button';
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
