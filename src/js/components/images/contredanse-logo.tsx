import React, { CSSProperties, ImgHTMLAttributes } from 'react';
import contredanseLogo from '../../../assets/images/logo-contredanse.png';
import { Omit } from 'utility-types';

type ContredanseLogoProps = {} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>;

const defaultProps = {
    alt: 'Contredanse',
} as ContredanseLogoProps;

export const ContredanseLogo: React.SFC<ContredanseLogoProps> = props => {
    const { ...innerProps } = props;
    return <img src={contredanseLogo} {...innerProps} />;
};

ContredanseLogo.defaultProps = defaultProps;
