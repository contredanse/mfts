import React from 'react';
import Home from '@src/components/home';
import { RouteComponentProps, withRouter } from 'react-router';
import AppAssetsLocator from '@src/core/app-assets-locator';
import ConnectedFullscreenButton from '@src/components/fullscreen-button';
import { LanguageContextConsumer } from '@src/context/language-context';

type HomeContainerProps = {
    assetsLocator: AppAssetsLocator;
} & RouteComponentProps<{}>;

type HomeContainerState = {};

class HomeContainer extends React.Component<HomeContainerProps, HomeContainerState> {
    constructor(props: HomeContainerProps) {
        super(props);
    }

    render() {
        const { assetsLocator } = this.props;

        return (
            <LanguageContextConsumer>
                {({ lang }) => {
                    return (
                        <div className="full-page-slide-ctn">
                            <Home assetsLocator={assetsLocator} lang={lang} />
                            <ConnectedFullscreenButton lang={lang} />
                        </div>
                    );
                }}
            </LanguageContextConsumer>
        );
    }
}

export default withRouter(HomeContainer);
