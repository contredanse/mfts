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
import EventListener from 'react-event-listener';

export type PageProps = {
    pageProxy: PageProxy;
    lang: string;
    menuBreadcrumb?: MenuSectionProps[];
    nextPage?: PageProxy;
    previousPage?: PageProxy;
    onPageChangeRequest?: (pageId: string) => void;
    onNewRouteRequest?: (routeSpec: string) => void;
    onPagePlayed?: () => void;
} & InjectedI18nProps;

export type PageState = {
    videoRefAvailable: boolean;
    audioRefAvailable: boolean;
    played: boolean;
    currentTime: number;
    isPlaying: boolean;
    playbackRate: number;
};

const defaultPageState: PageState = {
    videoRefAvailable: false,
    audioRefAvailable: false,
    played: false,
    currentTime: 0,
    isPlaying: true,
    playbackRate: 1,
};

class Page extends React.PureComponent<PageProps, PageState> {
    static defaultProps: Pick<PageProps, 'menuBreadcrumb'> = {
        menuBreadcrumb: [],
    };

    readonly state: PageState;

    mediaPlayerActions!: PlayerActions;
    controlBarActions!: Partial<ControlBarProps>;
    trackVisibilityHelper: TrackVisibilityHelper;

    private videoRef: React.RefObject<VideoProxyPlayer> = React.createRef<VideoProxyPlayer>();
    private audioRef: React.RefObject<VideoProxyPlayer> = React.createRef<VideoProxyPlayer>();

    constructor(props: PageProps) {
        super(props);

        this.state = defaultPageState;

        this.trackVisibilityHelper = new TrackVisibilityHelper();

        this.initMediaPlayerActions();

        this.initControlBarActions();
    }

    componentDidMount(): void {
        const { pageProxy } = this.props;
        const hasSingleVideoPlayer = pageProxy.isSingleVideoContent();
        const hasAudioPlayer = !hasSingleVideoPlayer && pageProxy.hasAudio();

        this.setState({
            videoRefAvailable: hasSingleVideoPlayer,
            audioRefAvailable: hasAudioPlayer,
        });
    }

    componentDidUpdate(prevProps: PageProps, nextState: PageState): void {
        if (this.props.pageProxy.pageId !== prevProps.pageProxy.pageId) {
            const { pageProxy } = this.props;
            const hasSingleVideoPlayer = pageProxy.isSingleVideoContent();
            const hasAudioPlayer = !hasSingleVideoPlayer && pageProxy.hasAudio();

            this.setState({
                currentTime: 0,
                playbackRate: 0,
                isPlaying: true,
                played: false,
                videoRefAvailable: hasSingleVideoPlayer,
                audioRefAvailable: hasAudioPlayer,
            });
        }
    }

    render() {
        const { pageProxy: page, lang, menuBreadcrumb } = this.props;

        const pageTitle = page.getTitle(lang);

        const isMultipleVideoContent = page.isMultiVideoContent();

        const videos = page.getVideos(lang);
        const audioProxy = page.getAudioProxy();

        const defaultSubtitleLang = lang;
        const subtitleVisibility = this.getSubtitleVisibility();

        const { videoRefAvailable, audioRefAvailable, played } = this.state;

        return (
            <div className="page-container">
                <EventListener target="window" onKeyPress={this.handleGlobalKeyPress} />
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
                                    onClick={(): void => {
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
                                {this.props.nextPage && (
                                    <button
                                        onClick={(): void => {
                                            if (this.props.onPageChangeRequest !== undefined) {
                                                this.props.onPageChangeRequest(this.props.nextPage!.pageId);
                                            }
                                        }}
                                    >
                                        Next
                                    </button>
                                )}
                                <img src={this.props.nextPage!.getFirstVideo()!.getFirstCover()} />
                            </div>
                            <div className="page-overlay-bottom">Played</div>
                        </div>
                    )}

                    {isMultipleVideoContent ? (
                        <div className="page-multi-video-layout">
                            <PanelMultiVideo
                                videos={videos}
                                pageProxy={page}
                                playing={this.state.isPlaying}
                                playbackRate={this.state.playbackRate}
                            />
                            {audioProxy && (
                                <div className="panel-audio-subs">
                                    <VideoProxyPlayer
                                        ref={this.audioRef}
                                        style={{ width: '100%', height: '100%' }}
                                        crossOrigin={'anonymous'}
                                        defaultSubtitleLang={defaultSubtitleLang}
                                        subtitleVisibility={subtitleVisibility}
                                        disablePoster={true}
                                        videoProxy={audioProxy}
                                        playing={this.state.isPlaying}
                                        onRateChange={this.onRateChange}
                                        onEnded={this.onEnded}
                                    />
                                </div>
                            )}
                            {(audioRefAvailable || !page.hasMainPlayer()) && (
                                <ControlBar
                                    lang={lang}
                                    videoEl={
                                        this.audioRef.current !== null
                                            ? (this.audioRef.current.getHTMLVideoElement() as HTMLVideoElement)
                                            : undefined
                                    }
                                    actions={this.mediaPlayerActions}
                                    playbackRate={this.state.playbackRate}
                                    enableNextControl={this.props.nextPage !== undefined}
                                    enablePrevControl={this.props.previousPage !== undefined}
                                    enableSpeedControl={true}
                                    {...this.controlBarActions}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="page-single-video-layout">
                            <div className="autoscale-video-container">
                                <div className="autoscale-video-wrapper autoscale-video-content">
                                    <VideoProxyPlayer
                                        ref={this.videoRef}
                                        style={{ width: '100%', height: '100%' }}
                                        crossOrigin={'anonymous'}
                                        defaultSubtitleLang={defaultSubtitleLang}
                                        subtitleVisibility={subtitleVisibility}
                                        // To prevent blinking
                                        disablePoster={true}
                                        videoProxy={page.getFirstVideo(lang)!}
                                        playing={this.state.isPlaying}
                                        playbackRate={this.state.playbackRate}
                                        onEnded={this.onEnded}
                                    />
                                </div>
                            </div>
                            {videoRefAvailable && (
                                <ControlBar
                                    lang={lang}
                                    videoEl={this.videoRef.current!.getHTMLVideoElement()!}
                                    actions={this.mediaPlayerActions}
                                    playbackRate={this.state.playbackRate}
                                    enableNextControl={this.props.nextPage !== undefined}
                                    enablePrevControl={this.props.previousPage !== undefined}
                                    enableSpeedControl={false}
                                    {...this.controlBarActions}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    private initControlBarActions(): void {
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

    /**
     * Return the main player media player (audio/video)
     * @returns {HTMLVideoElement | null}
     */
    private getMainPlayerVideoElement(): HTMLVideoElement | null {
        let videoEl: HTMLVideoElement | null = null;
        if (this.videoRef.current) {
            videoEl = this.videoRef.current.getHTMLVideoElement();
        }
        return videoEl;
    }

    private initMediaPlayerActions(): void {
        this.mediaPlayerActions = {
            // Actions
            pause: () => {
                this.setState({
                    isPlaying: false,
                });
            },
            play: () => {
                this.setState({
                    isPlaying: true,
                });
            },
            setPlaybackRate: playbackRate => {
                console.log('set playbackRate', playbackRate);
                this.setState((prevState, prevProps) => {
                    const newState = {
                        ...prevState,
                        playbackRate: playbackRate,
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

    private handleGlobalKeyPress = (e: KeyboardEvent) => {
        if ((e || window.event).key === ' ') {
            this.setState(prevState => ({
                isPlaying: !prevState.isPlaying,
            }));
        }
    };

    private onRateChange = (playbackRate: number) => {
        this.setState({
            playbackRate: playbackRate,
        });
    };

    private onEnded = (e: SyntheticEvent<HTMLVideoElement>) => {
        if (this.props.onPagePlayed) {
            this.props.onPagePlayed();
        } else {
            this.setState({
                played: true,
            });
        }
    };

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
