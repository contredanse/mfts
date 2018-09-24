import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './home.scss';
import SimpleVideo from '@src/components/simple-video';
import AppAssetsLocator from '@src/core/app-assets-locator';
import EventListener, { withOptions } from 'react-event-listener';
import contredanseLogo from '@assets/images/logo-contredanse.png';

type HomeProps = {
    assetsLocator: AppAssetsLocator;
    lang: string;
    playbackRate?: number;
} & RouteComponentProps;

type HomeState = {
    playbackRate: number;
};

const defaultProps = {
    playbackRate: 1,
} as HomeProps;

type I18nStatic = { [key: string]: { [key: string]: string } };

const i18n: I18nStatic = {
    a_movement_study: {
        en: 'A movement study',
        fr: 'Une étude du mouvement',
    },
};

class Home extends React.PureComponent<HomeProps, HomeState> {
    static readonly defaultProps: HomeProps = defaultProps;
    readonly state: HomeState;

    constructor(props: HomeProps) {
        super(props);
        this.state = {
            playbackRate: this.props.playbackRate!,
        };
    }

    navigateToIntro = (lang: string): void => {
        this.props.history.push(`${lang}/intro`);
    };

    handleMouseMove = (e: MouseEvent & PointerEvent) => {
        // TODO, let's make something cool when time.
        const x: number = e.clientX / window.innerWidth;
        const y: number = e.clientY / window.innerHeight;

        const playbackRate = Math.round(20 - y * 2 * 10) / 10;

        this.setState({
            playbackRate: playbackRate,
        });
    };

    handleWheelCapture = (e: WheelEvent) => {
        //console.log('mousecapture');
    };

    render() {
        const videosBaseUrl = this.props.assetsLocator.getMediaTypeBaseUrl('videos');

        const videoSrcs = [
            { src: `${videosBaseUrl}/puzzle2.webm`, type: 'video/webm' },
            { src: `${videosBaseUrl}/intro_2tubes_walk.mp4`, type: 'video/mp4' },
        ];

        const { lang } = this.props;
        const { playbackRate } = this.state;

        return (
            <section className="fullsize-video-bg">
                <EventListener
                    target={document}
                    onMouseMoveCapture={this.handleMouseMove}
                    onPointerMoveCapture={this.handleMouseMove}
                    onWheelCapture={this.handleWheelCapture}
                />
                <img
                    style={{ position: 'absolute', bottom: 0, right: 0, width: 60, opacity: 0.5 }}
                    src={contredanseLogo}
                    alt="Contredanse logo"
                />
                <div className="fullsize-video-inner">
                    <div>
                        <h3 className="reveal-text">Steve Paxton's</h3>
                        <h1 className="reveal-text">Material for the spine</h1>
                        <p className="reveal-text">
                            <a
                                className="clickable-text"
                                onClick={() => {
                                    this.navigateToIntro(lang);
                                }}
                            >
                                {i18n.a_movement_study[lang]}
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
                        playbackRate={playbackRate}
                        srcs={videoSrcs}
                    />
                </div>
            </section>
        );
    }
}

export default withRouter(Home);
