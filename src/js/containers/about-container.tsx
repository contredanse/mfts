import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import AppAssetsLocator from '@src/core/app-assets-locator';
import About from '@src/components/about';
import DocumentMeta from '@src/shared/document-meta';

type AboutContainerProps = {
    assetsLocator: AppAssetsLocator;
    lang: string;
} & RouteComponentProps<{}>;
type AboutContainerState = {};

class AboutContainer extends React.Component<AboutContainerProps, AboutContainerState> {
    constructor(props: AboutContainerProps) {
        super(props);
    }
    render() {
        const { lang, assetsLocator } = this.props;
        return (
            <div className="full-page-slide-ctn">
                <DocumentMeta title={'MFTS >> Introduction'} />
                <About assetsLocator={assetsLocator} lang={lang} />
            </div>
        );
    }
}

export default withRouter(AboutContainer);
