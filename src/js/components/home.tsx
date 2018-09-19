import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './home.scss';
import SimpleVideo from '@src/components/simple-video';
import AppAssetsLocator from '@src/core/app-assets-locator';

type HomeProps = {
    assetsLocator: AppAssetsLocator;
} & RouteComponentProps;

type HomeState = {};

class Home extends React.PureComponent<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
    }

    navigateToIntro = (lang: string): void => {
        console.log('props.history');
        this.props.history.push(`${lang}/intro`);
    };

    render() {
        const videosBaseUrl = this.props.assetsLocator.getMediaTypeBaseUrl('videos');

        const videoSrcs = [
            { src: `${videosBaseUrl}/intro_2tubes_walk.webm`, type: 'video/webm' },
            { src: `${videosBaseUrl}/intro_2tubes_walk.mp4`, type: 'video/mp4' },
        ];

        return (
            <section className="fullsize-video-bg">
                <div className="inner">
                    <div>
                        <h1 className="reveal-text">Material for the spine</h1>
                        <p className="reveal-text">
                            <a
                                className="clickable-text"
                                onClick={() => {
                                    this.navigateToIntro('en');
                                }}
                            >
                                A movement study
                            </a>
                            &nbsp;|&nbsp;
                            <a
                                className="clickable-text"
                                onClick={() => {
                                    this.navigateToIntro('fr');
                                }}
                            >
                                Une étude du mouvement
                            </a>
                        </p>
                    </div>
                </div>
                <div id="video-viewport">
                    <SimpleVideo
                        autoPlay={true}
                        muted={true}
                        playsInline={true}
                        loop={true}
                        style={
                            {
                                //border: '1px solid blue',
                            }
                        }
                        videoSrcs={videoSrcs}
                    />
                </div>
            </section>
        );

        return (
            <div
                className="intro-lang-selection"
                style={{
                    flex: '0 1 100%',
                    maxWidth: '700px',
                }}
            >
                <div
                    style={{ border: '1px solid blue' }}
                    onClick={() => {
                        this.navigateToIntro('en');
                    }}
                >
                    <a className="reveal-text">Material for the spine - a movement study</a>
                </div>
                <div
                    onClick={() => {
                        this.navigateToIntro('fr');
                    }}
                >
                    <a className="reveal-text">Material for the spine - une étude du mouvement</a>
                </div>

                <div
                    className="video-ctn-ctn-ctn"
                    style={{
                        //margin: '40px auto',
                        //outline: '1px solid #dadada',
                        width: '100%',
                    }}
                >
                    <SimpleVideo
                        autoPlay={true}
                        muted={true}
                        playsInline={true}
                        loop={true}
                        style={{
                            display: 'block',
                            //border: '1px solid blue',
                            width: '100%',
                            maxWidth: '700px',
                        }}
                        videoSrcs={videoSrcs}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(Home);
