import React, { SyntheticEvent } from 'react';

import { translate, InjectedI18nProps } from 'react-i18next';

import './page.scss';

import PageProxy from '@src/models/proxy/page-proxy';

import ControlBar, { ControlBarProps } from '@src/components/player/controls/control-bar';
import PanelMultiVideo from '@src/components/panel-multi-video';
import VideoProxyPlayer from '@src/components/player/data-proxy-player';
import { PlayerActions } from '@src/shared/player/player';
import { MenuSectionProps } from '@src/models/repository/menu-repository';
import PageBreadcrumb from '@src/components/page-breadcrumb';
import TrackVisibilityHelper, { TrackVisibilityMode } from '@src/components/player/track/track-visibility-helper';

export type PageProps = {
    pageProxy: PageProxy;
    lang: string;
    menuBreadcrumb?: MenuSectionProps[];
    nextPage?: PageProxy;
    previousPage?: PageProxy;
    onPageChangeRequest?: (pageId: string) => void;
    onPagePlayed?: () => void;
} & InjectedI18nProps;

export type PlaybackState = {
    currentTime: number;
    isPlaying: boolean;
    duration: number;
    videoWidth: number;
    videoHeight: number;
    playbackRate: number;
    isMetadataLoaded: boolean;
};

export type PageState = {
    videoRefAvailable: boolean;
    playbackState: PlaybackState;
    played: boolean;
};

const defaultPlaybackState: PlaybackState = {
    currentTime: 0,
    isPlaying: true,
    duration: 0,
    playbackRate: 1,
    videoWidth: 0,
    videoHeight: 0,
    isMetadataLoaded: false,
};

class Page extends React.PureComponent<PageProps, PageState> {
    static defaultProps: Pick<PageProps, 'menuBreadcrumb'> = {
        menuBreadcrumb: [],
    };

    readonly state: PageState;

    playerRef!: React.RefObject<VideoProxyPlayer>;

    mediaPlayerActions!: PlayerActions;

    controlBarActions!: Partial<ControlBarProps>;

    trackVisibilityHelper: TrackVisibilityHelper;

    constructor(props: PageProps) {
        super(props);

        const playerInitialState: PlaybackState = defaultPlaybackState;

        this.state = {
            videoRefAvailable: false,
            played: false,
            playbackState: playerInitialState,
        };

        this.trackVisibilityHelper = new TrackVisibilityHelper();

        this.initMediaPlayerActions();

        this.playerRef = React.createRef<VideoProxyPlayer>();

        this.initControlBarActions();
    }

    componentDidMount(): void {
        this.setState(prevState => ({
            playbackState: prevState.playbackState,
            videoRefAvailable: true,
        }));
    }

    initControlBarActions(): void {
        this.controlBarActions = {
            onNextLinkPressed: () => {
                if (this.props.nextPage !== undefined && this.props.onPageChangeRequest !== undefined) {
                    this.props.onPageChangeRequest(this.props.nextPage.pageId);
                }
            },
            onPreviousLinkPressed: () => {
                if (this.props.previousPage !== undefined && this.props.onPageChangeRequest !== undefined) {
                    this.props.onPageChangeRequest(this.props.previousPage.pageId);
                }
            },
        };
    }

    onEnded = (e: SyntheticEvent<HTMLVideoElement>) => {
        if (this.props.onPagePlayed) {
            this.props.onPagePlayed();
        } else {
            this.setState({
                played: true,
            });
        }
    };

    render() {
        const { pageProxy: page, lang, menuBreadcrumb } = this.props;

        const countVideos = page.countVideos();

        const hasMultipleVideos = countVideos > 1;
        const pageTitle = page.getTitle(lang);
        const { videoRefAvailable, played } = this.state;

        const videos = page.getVideos(lang);
        const audioProxy = page.getAudioProxy();

        const defaultSubtitleLang = lang;
        const subtitleVisibility = this.getSubtitleVisibility();

        console.log('rerender', defaultSubtitleLang);
        return (
            <div className="page-container">
                <div className="page-header">
                    <PageBreadcrumb title={pageTitle} sections={menuBreadcrumb} lang={lang} />
                </div>
                <div className="page-content">
                    {played && (
                        <div className="page-overlay page-overlay--active">
                            <div className="page-overlay-top">The top</div>
                            <div className="page-overlay-middle">
                                I'm the center zone
                                <button
                                    onClick={() => {
                                        this.setState((prevState: PageState, prevProps: PageProps) => {
                                            const videoEl = this.getMainPlayerVideoElement();
                                            if (videoEl) {
                                                videoEl.currentTime = 0;
                                                videoEl.play();
                                            }
                                            const newState = {
                                                ...prevState,
                                                played: false,
                                            };
                                            return newState;
                                        });
                                    }}
                                >
                                    Replay
                                </button>
                                <button
                                    onClick={() => {
                                        this.setState((prevState: PageState, prevProps: PageProps) => {
                                            const newState = {
                                                ...prevState,
                                                played: false,
                                            };
                                            return newState;
                                        });
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="page-overlay-bottom">Played</div>
                        </div>
                    )}

                    {hasMultipleVideos ? (
                        <div className="page-multi-video-layout">
                            <PanelMultiVideo
                                videos={videos}
                                pageProxy={page}
                                playing={this.state.playbackState.isPlaying}
                                playbackRate={this.state.playbackState.playbackRate}
                            />
                            {audioProxy && (
                                <div className="panel-audio-subs">
                                    <VideoProxyPlayer
                                        ref={this.playerRef}
                                        style={{ width: '100%', height: '100%' }}
                                        crossOrigin={'anonymous'}
                                        defaultSubtitleLang={defaultSubtitleLang}
                                        subtitleVisibility={subtitleVisibility}
                                        videoProxy={audioProxy}
                                        playing={this.state.playbackState.isPlaying}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="page-single-video-layout">
                            <div className="autoscale-video-container">
                                <div className="autoscale-video-wrapper autoscale-video-content">
                                    <VideoProxyPlayer
                                        ref={this.playerRef}
                                        style={{ width: '100%', height: '100%' }}
                                        crossOrigin={'anonymous'}
                                        defaultSubtitleLang={defaultSubtitleLang}
                                        subtitleVisibility={subtitleVisibility}
                                        // To prevent blinking
                                        disablePoster={true}
                                        videoProxy={page.getFirstVideo(lang)!}
                                        playing={this.state.playbackState.isPlaying}
                                        playbackRate={this.state.playbackState.playbackRate}
                                        onEnded={this.onEnded}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    {videoRefAvailable && (
                        <ControlBar
                            key={page.pageId}
                            lang={lang}
                            videoEl={this.getMainPlayerVideoElement()!}
                            actions={this.mediaPlayerActions}
                            duration={this.state.playbackState.duration}
                            playbackRate={this.state.playbackState.playbackRate}
                            enableNextControl={this.props.nextPage !== undefined}
                            enablePrevControl={this.props.previousPage !== undefined}
                            enableSpeedControl={false}
                            {...this.controlBarActions}
                        />
                    )}
                </div>
            </div>
        );
    }

    /**
     * Return the main player media player (audio/video)
     * @returns {HTMLVideoElement | null}
     */
    private getMainPlayerVideoElement(): HTMLVideoElement | null {
        let videoEl: HTMLVideoElement | null = null;
        if (this.playerRef.current) {
            videoEl = this.playerRef.current.getHTMLVideoElement();
        }
        console.log('GETMAINPLAYERVIDEOELEMENT', videoEl);
        return videoEl;
    }

    private initMediaPlayerActions(): void {
        this.mediaPlayerActions = {
            // Actions
            pause: () => {
                this.setState((prevState, prevProps) => {
                    const newState = {
                        ...prevState,
                        ...{ playbackState: { ...prevState.playbackState, isPlaying: false } },
                    };
                    return newState;
                });
            },
            play: () => {
                this.setState((prevState, prevProps) => {
                    const newState = {
                        ...prevState,
                        ...{ playbackState: { ...prevState.playbackState, isPlaying: true } },
                    };
                    return newState;
                });
            },
            setPlaybackRate: playbackRate => {
                console.log('set playbackRate', playbackRate);
                this.setState((prevState, prevProps) => {
                    const newState = {
                        ...prevState,
                        ...{ playbackState: { ...prevState.playbackState, playbackRate: playbackRate } },
                    };
                    return newState;
                });
            },

            setCurrentTime: time => {
                console.log('set current time', time);
                const videoEl = this.getMainPlayerVideoElement();
                if (videoEl) {
                    videoEl.currentTime = time;
                }
            },
        };
    }

    private updatePlaybackState(deltaState: Partial<PlaybackState>): void {
        this.setState((prevState: PageState) => {
            return { ...prevState, playbackState: { ...prevState.playbackState, ...deltaState } };
        });
    }

    /**
     * To re-enable track captions
     */
    private getSubtitleVisibility(): TrackVisibilityMode {
        const { lang } = this.props;
        const visibilityMode = this.trackVisibilityHelper.getVisibilityModeFromStorage();

        if (!visibilityMode) {
            // nothing persisted, let's go default
            // if lang is french, auto show subtitles in french
            return lang === 'fr' ? 'showing' : 'hidden';
        }

        return visibilityMode;
    }
}

export default translate()(Page);
