import React from 'react';
import Home from '@src/components/home';
import { RouteComponentProps, withRouter } from 'react-router';

type HomeContainerProps = {} & RouteComponentProps<{}>;
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

export default withRouter(HomeContainer);
