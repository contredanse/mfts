import * as React from 'react';
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
        this.props.history.push(`${lang}/intro`);
    };

    render() {
        const videosBaseUrl = this.props.assetsLocator.getMediaTypeBaseUrl('videos');

        const videoSrcs = [
            { src: `${videosBaseUrl}/puzzle2.webm`, type: 'video/webm' },
            { src: `${videosBaseUrl}/intro_2tubes_walk.mp4`, type: 'video/mp4' },
        ];

        return (
            <section className="fullsize-video-bg">
                <div className="fullsize-video-inner">
                    <div>
                        <h3 className="reveal-text">Steve Paxton's</h3>
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
                <div id="fullsize-video-viewport">
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
    }
}

export default withRouter(Home);
