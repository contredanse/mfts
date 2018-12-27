import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './home.scss';
import { debounce } from 'throttle-debounce';
import AppAssetsLocator from '@src/core/app-assets-locator';
import EventListener from 'react-event-listener';
import FullsizeVideoBg from '@src/components/layout/fullsize-video-bg';
import ConnectedLangSelector from '@src/components/lang-selector';
import { BasicI18nDictionary } from '@src/i18n/basic-i18n';
import contredanseLogo from '@assets/images/logo-contredanse-white.jpg';
import PwaInstaller from '@src/components/pwa-installer';

type HomeProps = {
    assetsLocator: AppAssetsLocator;
    lang: string;
    playbackRate?: number;
    mouseMoveDelay?: number;
    videosIds?: string[];
    // Don't ask me why (requested as this)
    useClickableBox?: boolean;
} & RouteComponentProps;

type HomeState = {
    videoNumber: number;
    playbackRate: number;
};

const defaultProps = {
    playbackRate: 0.5,
    mouseMoveDelay: 80,
    useClickableBox: true,
    //videosIds: ['intro_2tubes_walk'],
    videosIds: ['cbfhu'],
    //https://assets.materialforthespine.com/videos/cbfhu.webm
};

const i18n: BasicI18nDictionary = {
    a_movement_study: {
        en: 'A movement study',
        fr: 'Une étude du mouvement',
    },
};

class Home extends React.PureComponent<HomeProps, HomeState> {
    static defaultProps = defaultProps;
    readonly state: HomeState;

    constructor(props: HomeProps) {
        super(props);
        this.state = {
            videoNumber: 0,
            playbackRate: this.props.playbackRate!,
        };
        this.changePlaybackRate = debounce(this.props.mouseMoveDelay!, this.changePlaybackRate);
    }

    navigateToIntro = (): void => {
        const { lang } = this.props;
        this.props.history.push(`${lang}/intro`);
    };

    changePlaybackRate = (playbackRate: number) => {
        this.setState({
            playbackRate: playbackRate,
        });
    };

    handleMove = (e: MouseEvent & PointerEvent) => {
        // TODO, let's make something cool when time.
        /*
        const y: number = e.clientY / window.innerHeight;
        const playbackRate = Math.round(20 - y * 2 * 10) / 10;
        if (playbackRate < 1.3 && playbackRate > 0.3 && this.state.playbackRate !== playbackRate) {
            this.changePlaybackRate(playbackRate);
        }
        */
    };

    render() {
        const videosBaseUrl = this.props.assetsLocator.getMediaTypeBaseUrl('videos');

        const videoId = this.props.videosIds![this.state.videoNumber];

        const videoSrcs = [
            { src: `${videosBaseUrl}/${videoId}.webm`, type: 'video/webm' },
            { src: `${videosBaseUrl}/${videoId}.mp4`, type: 'video/mp4' },
        ];

        const { lang, useClickableBox } = this.props;
        const { playbackRate } = this.state;

        return (
            <div className="home-container">
                <PwaInstaller />
                <ConnectedLangSelector>
                    {({ currentLang, nextLang, toggleLang, updateLang }) => (
                        <div className="lang-selector-panel" onClick={() => updateLang(nextLang)}>
                            {nextLang === 'en' ? 'English' : 'Français'}
                        </div>
                    )}
                </ConnectedLangSelector>

                <FullsizeVideoBg videoSrcs={videoSrcs} playbackRate={playbackRate} autoPlay={true} loop={true}>
                    <div
                        className="home-container-text-panel"
                        {...(useClickableBox ? { onClick: this.navigateToIntro } : {})}
                        onClick={this.navigateToIntro}
                    >
                        <h3 className="reveal-text">Steve Paxton</h3>
                        <h1 className="reveal-text">Material for the spine</h1>
                        <p className="reveal-text">
                            <a
                                className="clickable-text"
                                {...(!useClickableBox ? { onClick: this.navigateToIntro } : {})}
                            >
                                {i18n.a_movement_study[lang] || ''}
                            </a>
                        </p>
                    </div>
                </FullsizeVideoBg>

                <img className="logo-contredanse" src={contredanseLogo} alt="Contredanse logo" />
                <EventListener
                    target={document}
                    onMouseMoveCapture={this.handleMove}
                    onPointerMoveCapture={this.handleMove}
                />
            </div>
        );
    }

    handleOnEnded = () => {
        this.setState({
            videoNumber: 1,
        });
    };
}

export default withRouter(Home);
