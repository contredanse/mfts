import React from 'react';
import './about.scss';
import contredanseLogo from '@assets/images/logo-contredanse.png';
import AppAssetsLocator from '@src/core/app-assets-locator';

import credits_en from '@data/markdown/credits.en.md';
import credits_fr from '@data/markdown/credits.fr.md';
import WebpackMarkdown from '@src/components/webpack-markdown';
import FullsizeVideoBg from '@src/components/fullsize-video-bg';
import Page from '@src/components/page';
import { PageOverlay } from '@src/components/layout/page-overlay';
import { CustomScrollbar } from '@src/components/layout/custom-scrollbar';

type AboutProps = {
    assetsLocator: AppAssetsLocator;
    lang: string;
};

type AboutState = {};

class About extends React.PureComponent<AboutProps, AboutState> {
    constructor(props: AboutProps) {
        super(props);
    }

    render() {
        const { lang } = this.props;
        const videosBaseUrl = this.props.assetsLocator.getMediaTypeBaseUrl('videos');

        const videoSrcs = [
            { src: `${videosBaseUrl}/intro_2tubes_walk.webm`, type: 'video/webm' },
            { src: `${videosBaseUrl}/intro_2tubes_walk.mp4`, type: 'video/mp4' },
        ];

        const content = lang === 'fr' ? credits_fr : credits_en;

        return (
            <div className="about-container">
                <FullsizeVideoBg videoSrcs={videoSrcs}>
                    <CustomScrollbar>
                        <WebpackMarkdown content={content} />
                    </CustomScrollbar>
                </FullsizeVideoBg>
            </div>
        );
    }
}

export default About;
