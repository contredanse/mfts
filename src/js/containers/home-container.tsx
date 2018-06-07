import React from 'react';
import Home from '@src/components/home';

type HomeContainerProps = {};
type HomeContainerState = {};

class HomeContainer extends React.Component<HomeContainerProps, HomeContainerState> {
    constructor(props: HomeContainerProps) {
        super(props);
    }

    render() {
        return (
            <div className="full-page-slide-ctn">
                <Home />
            </div>
        );
    }
}

export default HomeContainer;
