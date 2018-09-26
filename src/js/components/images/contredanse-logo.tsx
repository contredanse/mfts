import React, { CSSProperties } from 'react';
import contredanseLogo from '../../../assets/images/logo-contredanse.png';

type ContredanseLogoProps = {
    style?: CSSProperties;
};

const defaultStyle = {} as CSSProperties;

export const ContredanseLogo: React.SFC<ContredanseLogoProps> = props => {
    let { style } = props;
    if (!style) {
        style = defaultStyle;
    }
    return <img style={style} src={contredanseLogo} alt="Contredanse" />;
};
