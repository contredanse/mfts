import React from 'react';
import Home from '@src/components/home';
import { RouteComponentProps, withRouter } from 'react-router';
import AppAssetsLocator from '@src/core/app-assets-locator';

type HomeContainerProps = {
    assetsLocator: AppAssetsLocator;
} & RouteComponentProps<{}>;
type HomeContainerState = {};

class HomeContainer extends React.Component<HomeContainerProps, HomeContainerState> {
    constructor(props: HomeContainerProps) {
        super(props);
    }
    render() {
        return (
            <div className="full-page-slide-ctn">
                <Home assetsLocator={this.props.assetsLocator} />
            </div>
        );
    }
}

export default withRouter(HomeContainer);
