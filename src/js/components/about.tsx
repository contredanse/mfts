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
        let video = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
        video = 'https://assets.materialforthespine.com/videos/intro_2tubes_walk.webm';

        // <source src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" type="video/mp4" />
        return (
            <section className="fullsize-video-bg">
                <div className="inner">
                    <div>
                        <h1>Material for the spine</h1>
                        <p>
                            <a href="#">A movement study</a>
                            &nbsp;|&nbsp;
                            <a href="#">Une étude du mouvement</a>
                        </p>
                    </div>
                </div>
                <div id="video-viewport">
                    <video autoPlay muted loop>
                        <source src={video} />
                    </video>
                </div>
            </section>
        );
    }
}

export default About;
