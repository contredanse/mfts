import React from 'react';
import './about.scss';
import AppAssetsLocator from '@src/core/app-assets-locator';
import WebpackMarkdown from '@src/components/webpack-markdown';
import FullsizeVideoBg from '@src/components/layout/fullsize-video-bg';
import { CustomScrollbar } from '@src/components/layout/custom-scrollbar';

type AboutProps = {
    assetsLocator: AppAssetsLocator;
    lang: string;
    content?: string;
    mdClassName?: string;
};

type AboutState = {};

const defaultProps = {
    content: '',
    mdClassName: 'static-content-markdown',
};

class About extends React.PureComponent<AboutProps, AboutState> {
    static defaultProps = defaultProps;
    constructor(props: AboutProps) {
        super(props);
    }

    render() {
        const { lang, content, mdClassName } = this.props;
        const videosBaseUrl = this.props.assetsLocator.getMediaTypeBaseUrl('videos');

        const videoSrcs = [{ src: `${videosBaseUrl}/napp.webm`, type: 'video/webm' }];

        return (
            <div className="about-container">
                <FullsizeVideoBg videoSrcs={videoSrcs}>
                    <CustomScrollbar>
                        <WebpackMarkdown className={mdClassName} content={content!} />
                    </CustomScrollbar>
                </FullsizeVideoBg>
            </div>
        );
    }
}

export default About;
