import React from 'react';
import Home from '@src/components/home';
import { RouteComponentProps, withRouter } from 'react-router';
import AppAssetsLocator from '@src/core/app-assets-locator';
import About from '@src/components/about';

type AboutContainerProps = {
    assetsLocator: AppAssetsLocator;
} & RouteComponentProps<{}>;
type AboutContainerState = {};

class AboutContainer extends React.Component<AboutContainerProps, AboutContainerState> {
    constructor(props: AboutContainerProps) {
        super(props);
    }
    render() {
        return (
            <div className="full-page-slide-ctn">
                <About assetsLocator={this.props.assetsLocator} />
            </div>
        );
    }
}

export default withRouter(AboutContainer);
