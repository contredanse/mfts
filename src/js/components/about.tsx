import React from 'react';
import './about.scss';
import AppAssetsLocator from '@src/core/app-assets-locator';
import WebpackMarkdown from '@src/components/webpack-markdown';
import AppBarPortal from '@src/components/navigation/app-bar-portal';

type AboutProps = {
    assetsLocator: AppAssetsLocator;
    lang: string;
    content?: string;
    title?: string;
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
        const { lang, content, title, mdClassName } = this.props;
        const videosBaseUrl = this.props.assetsLocator.getMediaTypeBaseUrl('videos');

        const videoSrcs = [{ src: `${videosBaseUrl}/napp.webm`, type: 'video/webm' }];

        return (
            <div className="about-container">
                <AppBarPortal>
                    <div>{title}</div>
                </AppBarPortal>

                <WebpackMarkdown className={mdClassName} content={content!} />
            </div>
        );
    }
}

export default About;
