import React, { SyntheticEvent } from 'react';

import { translate, InjectedI18nProps } from 'react-i18next';

import './page.scss';

import PageProxy from '@src/models/proxy/page-proxy';

import ControlBar, { ControlBarProps } from '@src/components/player/controls/control-bar';
import PanelMultiVideo from '@src/components/panel-multi-video';
import VideoProxyPlayer from '@src/components/player/data-proxy-player';
import { MenuSectionProps } from '@src/models/repository/menu-repository';
import PageBreadcrumb from '@src/components/page-breadcrumb';
import TrackVisibilityHelper, { TrackVisibilityMode } from '@src/components/player/track/track-visibility-helper';
import EventListener from 'react-event-listener';
import PagePlaybackOverlay from '@src/components/page-playback-overlay';

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
    isSilent: boolean;
    isMultipleVideoContent: boolean;
    played: boolean;
    currentTime: number;
    isPlaying: boolean;
    playbackRate: number;
};

const defaultPageState: PageState = {
    videoRefAvailable: false,
    audioRefAvailable: false,
    isSilent: false,
    isMultipleVideoContent: false,
    played: false,
    currentTime: 0,
    isPlaying: true,
    playbackRate: 1,
};

const defaultProps = {
    menuBreadcrumb: [],
};

class Page extends React.PureComponent<PageProps, PageState> {
    static defaultProps = defaultProps;

    readonly state: PageState;

    trackVisibilityHelper: TrackVisibilityHelper;

    private videoRef: React.RefObject<VideoProxyPlayer> = React.createRef<VideoProxyPlayer>();
    private audioRef: React.RefObject<VideoProxyPlayer> = React.createRef<VideoProxyPlayer>();

    constructor(props: PageProps) {
        super(props);
        this.state = defaultPageState;
        this.trackVisibilityHelper = new TrackVisibilityHelper();
    }

    componentDidMount(): void {
        const { pageProxy } = this.props;
        const hasSingleVideoPlayer = pageProxy.isSingleVideoContent();
        const hasAudioPlayer = !hasSingleVideoPlayer && pageProxy.hasAudio();
        this.setState({
            ...defaultPageState,
            videoRefAvailable: hasSingleVideoPlayer,
            audioRefAvailable: hasAudioPlayer,
            isSilent: pageProxy.isSilent(),
            isMultipleVideoContent: pageProxy.isMultiVideoContent(),
        });
    }

    componentDidUpdate(prevProps: PageProps, nextState: PageState): void {
        if (this.props.pageProxy.pageId !== prevProps.pageProxy.pageId) {
            const { pageProxy } = this.props;
            const hasSingleVideoPlayer = pageProxy.isSingleVideoContent();
            const hasAudioPlayer = !hasSingleVideoPlayer && pageProxy.hasAudio();
            this.setState({
                ...defaultPageState,
                isPlaying: true,
                played: false,
                videoRefAvailable: hasSingleVideoPlayer,
                audioRefAvailable: hasAudioPlayer,
                isSilent: pageProxy.isSilent(),
                isMultipleVideoContent: pageProxy.isMultiVideoContent(),
            });
        }
    }

    render() {
        const { pageProxy: page, lang, menuBreadcrumb } = this.props;

        const pageTitle = page.getTitle(lang);

        const defaultSubtitleLang = lang;
        const subtitleVisibility = this.getSubtitleVisibility();

        const { videoRefAvailable, isMultipleVideoContent, audioRefAvailable, played, isSilent } = this.state;

        const audioProxy = page.getAudioProxy();

        console.log('rerender', isSilent);
        return (
            <div className="page-container">
                <EventListener target="window" onKeyPress={this.handleGlobalKeyPress} />
                <div className="page-header">
                    <PageBreadcrumb title={pageTitle} sections={menuBreadcrumb} lang={lang} />
                    {isSilent ? 'solie' : ''}
                </div>
                <div className="page-content">
                    {played && (
                        <PagePlaybackOverlay
                            nextPage={this.props.nextPage}
                            onReplayRequest={this.handleReplayRequest}
                            onPlayNextRequest={this.handlePlayNextRequest}
                        />
                    )}

                    {isMultipleVideoContent ? (
                        <div className="page-multi-video-layout">
                            <PanelMultiVideo
                                videos={page.getVideos(lang)}
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
                                        onPlaybackChange={this.handlePlaybackChange}
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
                                    playbackRate={this.state.playbackRate}
                                    enableNextControl={this.props.nextPage !== undefined}
                                    enablePrevControl={this.props.previousPage !== undefined}
                                    enableSpeedControl={true}
                                    onNextLinkPressed={this.handlePlayNextRequest}
                                    onPreviousLinkPressed={this.handlePlayPreviousRequest}
                                    disableButtonSpaceClick={true}
                                    mediaIsSilent={isSilent}
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
                                        onPlaybackChange={this.handlePlaybackChange}
                                        onEnded={this.onEnded}
                                    />
                                </div>
                            </div>
                            {videoRefAvailable && (
                                <ControlBar
                                    lang={lang}
                                    videoEl={
                                        this.videoRef.current ? this.videoRef.current.getHTMLVideoElement() : undefined
                                    }
                                    playbackRate={this.state.playbackRate}
                                    enableNextControl={this.props.nextPage !== undefined}
                                    enablePrevControl={this.props.previousPage !== undefined}
                                    enableSpeedControl={false}
                                    onNextLinkPressed={this.handlePlayNextRequest}
                                    onPreviousLinkPressed={this.handlePlayPreviousRequest}
                                    disableButtonSpaceClick={true}
                                    mediaIsSilent={isSilent}
                                />
                            )}
                        </div>
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
        if (this.videoRef.current) {
            videoEl = this.videoRef.current.getHTMLVideoElement();
        }
        return videoEl;
    }

    private handleGlobalKeyPress = (e: KeyboardEvent) => {
        if ((e || window.event).key === ' ') {
            console.log('handleGlobalKeyPress');
            this.setState(prevState => ({
                isPlaying: !prevState.isPlaying,
            }));
        }
    };

    private handlePlaybackChange = (isPlaying: boolean) => {
        this.setState((prevState: PageState) => {
            console.log('handlePlaybackChange');
            // reset played state. do not change isPlaying
            // otherwise it's gonna be recursive
            const newState = {
                ...prevState,
                played: isPlaying ? false : prevState.played,
            };
            return newState;
        });
    };

    private handleReplayRequest = () => {
        console.log('handleReplayRequest');

        this.setState((prevState: PageState) => {
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
    };

    private handlePlayNextRequest = (): void => {
        console.log('handlePlayNextRequest');
        if (this.props.nextPage !== undefined && this.props.onPageChangeRequest !== undefined) {
            this.props.onPageChangeRequest(this.props.nextPage.pageId);
        }
    };

    private handlePlayPreviousRequest = (): void => {
        console.log('handlePlayPreviousRequest');
        if (this.props.previousPage !== undefined && this.props.onPageChangeRequest !== undefined) {
            this.props.onPageChangeRequest(this.props.previousPage.pageId);
        }
    };

    private onRateChange = (playbackRate: number) => {
        this.setState({
            playbackRate: playbackRate,
        });
    };

    private onEnded = (e: SyntheticEvent<HTMLVideoElement>) => {
        console.log('handleOnPagePlayed');
        if (this.props.onPagePlayed) {
            this.props.onPagePlayed();
        } else {
            this.setState({
                played: true,
            });
        }
    };

    /**
     * To re-enable track captions from user choice
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
