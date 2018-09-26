import React from 'react';
import loadingSvg from '@assets/svg/controlbar-loading-button-2.svg';
import './buttons.scss';

class LoadingButton extends React.Component<{}, {}> {
    render() {
        return (
            <div className="loading-button">
                <img src={loadingSvg} />
            </div>
        );
    }
}
export default LoadingButton;
