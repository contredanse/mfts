import React from 'react';
import Home from '@src/components/home';
import { RouteComponentProps, withRouter } from 'react-router';
import AppAssetsLocator from '@src/core/app-assets-locator';
import { ApplicationState } from '@src/store';
import { connect } from 'react-redux';

type PropsFromReduxState = {
    lang: string;
};

type HomeContainerProps = {
    assetsLocator: AppAssetsLocator;
} & RouteComponentProps<{}> &
    PropsFromReduxState;
type HomeContainerState = {};

class HomeContainer extends React.Component<HomeContainerProps, HomeContainerState> {
    constructor(props: HomeContainerProps) {
        super(props);
    }

    render() {
        const { assetsLocator, lang } = this.props;
        return (
            <div className="full-page-slide-ctn">
                <Home assetsLocator={assetsLocator} lang={lang} playbackRate={0.6} />
            </div>
        );
    }
}

const mapStateToProps = ({ locale }: ApplicationState) => ({
    lang: locale.langCode,
});

export default withRouter(connect(mapStateToProps)(HomeContainer));
