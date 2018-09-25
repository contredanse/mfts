import React, { CSSProperties } from 'react';
import contredanseLogo from '@assets/images/logo-contredanse.png';

type ContredanseLogoProps = {
    style: CSSProperties;
};

export const ContredanseLogo: React.SFC<ContredanseLogoProps> = props => {
    return <img style={props.style} src={contredanseLogo} alt="Contredanse" />;
};
