import React from 'react';
import './about.scss';
import AppAssetsLocator from '@src/core/app-assets-locator';

type AboutProps = {
    assetsLocator: AppAssetsLocator;
};

type AboutState = {};

class About extends React.PureComponent<AboutProps, AboutState> {
    constructor(props: AboutProps) {
        super(props);
    }

    render() {
        return (
            <section className="fullsize-video-bg">
                <div className="inner">
                    <div>
                        <h1>Responsive Background Video</h1>
                        <p>with color and dot-grid overlay</p>
                    </div>
                </div>
                <div id="video-viewport">
                    <video width="1920" height="1280" autoPlay muted loop>
                        <source src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" type="video/mp4" />
                        <source src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.webm" type="video/webm" />
                    </video>
                </div>
            </section>
        );
    }
}

export default About;
