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
        const { content, title, mdClassName } = this.props;
        return (
            <div className="about-container">
                <AppBarPortal>
                    <div>{title}</div>
                </AppBarPortal>
                <div className={'bg'} />
                <WebpackMarkdown className={mdClassName} content={content!} />
            </div>
        );
    }
}

export default About;
