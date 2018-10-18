import React, { SyntheticEvent } from 'react';

import { translate, InjectedI18nProps } from 'react-i18next';

import './page.scss';

import PageProxy from '@src/models/proxy/page-proxy';

import ControlBar, { ControlBarProps } from '@src/components/player/controls/control-bar';
import PanelMultiVideo from '@src/components/panel-multi-video';
import VideoProxyPlayer from '@src/components/player/data-proxy-player';
import MenuRepository, { MenuSectionProps, PrevAndNextPageEntities } from '@src/models/repository/menu-repository';
import PageBreadcrumb from '@src/components/page-breadcrumb';
import TrackVisibilityHelper, { TrackVisibilityMode } from '@src/components/player/track/track-visibility-helper';
import EventListener from 'react-event-listener';
import PagePlaybackOverlay from '@src/components/page-playback-overlay';
import VideoPlayer from '@src/components/player/video-player';

export type PageProps = {
    pageProxy: PageProxy;
    menuRepository?: MenuRepository;
    lang: string;
    onPageChangeRequest?: (pageId: string) => void;
    onNewRouteRequest?: (routeSpec: string) => void;
    onPagePlayed?: () => void;
} & InjectedI18nProps;

export type PageState = {
    isSilent: boolean;
    isMultipleVideoContent: boolean;
    played: boolean;
    currentTime: number;
    isPlaying: boolean;
    playbackRate: number;
    breadcrumb: MenuSectionProps[];
    previousPage?: PageProxy;
    nextPage?: PageProxy;
};

const defaultPageState: PageState = {
    isSilent: false,
    isMultipleVideoContent: false,
    played: false,
    currentTime: 0,
    isPlaying: true,
    playbackRate: 1,
    breadcrumb: [],
};

const defaultProps = {};

class Page extends React.PureComponent<PageProps, PageState> {
    static defaultProps = defaultProps;

    readonly state: PageState;

    trackVisibilityHelper: TrackVisibilityHelper;

    private mainPlayerRef: React.RefObject<VideoProxyPlayer> = React.createRef<VideoProxyPlayer>();

    constructor(props: PageProps) {
        super(props);
        this.state = defaultPageState;
        this.trackVisibilityHelper = new TrackVisibilityHelper();

        const pageId = this.props.pageProxy.pageId;
        const { previousPage, nextPage } = this.getPrevAndNextPageEntities(pageId);
        this.state = {
            ...defaultPageState,
            isSilent: props.pageProxy.isSilent(),
            isMultipleVideoContent: props.pageProxy.isMultiVideoContent(),
            breadcrumb: this.getMenuBreadcrumb(pageId),
            previousPage: previousPage,
            nextPage: nextPage,
        };
    }

    componentDidMount(): void {
        const { pageProxy } = this.props;
        const hasSingleVideoPlayer = pageProxy.isSingleVideoContent();
        const hasAudioPlayer = !hasSingleVideoPlayer && pageProxy.hasAudio();
    }

    componentDidUpdate(prevProps: PageProps, nextState: PageState): void {
        if (this.props.pageProxy.pageId !== prevProps.pageProxy.pageId) {
            const { pageProxy } = this.props;
            const hasSingleVideoPlayer = pageProxy.isSingleVideoContent();
            const hasAudioPlayer = !hasSingleVideoPlayer && pageProxy.hasAudio();
            const pageId = this.props.pageProxy.pageId;
            const { previousPage, nextPage } = this.getPrevAndNextPageEntities(pageId);
            this.setState({
                isPlaying: true,
                played: false,
                isSilent: pageProxy.isSilent(),
                isMultipleVideoContent: pageProxy.isMultiVideoContent(),
                breadcrumb: this.getMenuBreadcrumb(pageId),
                previousPage: previousPage,
                nextPage: nextPage,
            });
        }
    }

    render() {
        const { pageProxy: page, lang, menuRepository } = this.props;

        const pageTitle = page.getTitle(lang);

        const defaultSubtitleLang = lang;
        const subtitleVisibility = this.getSubtitleVisibility();

        const { isMultipleVideoContent, played, isSilent } = this.state;

        const audioProxy = page.getAudioProxy();

        const controlBarProps: ControlBarProps = {
            lang: lang,
            playbackRate: this.state.playbackRate,
            enableSpeedControl: this.state.isSilent || isMultipleVideoContent,
            mediaIsSilent: this.state.isSilent,
            disableButtonSpaceClick: true,
            enableNextControl: this.state.nextPage !== undefined,
            enablePrevControl: this.state.previousPage !== undefined,
            onNextLinkPressed: this.handlePlayNextRequest,
            onPreviousLinkPressed: this.handlePlayPreviousRequest,
            onRateChangeRequest: this.handleRateChange,
        };

        console.log('RENDER/PAGE', controlBarProps);

        return (
            <div className="page-container">
                <EventListener target="window" onKeyPress={this.handleGlobalKeyPress} />
                <div className="page-header">
                    <PageBreadcrumb title={pageTitle} sections={this.state.breadcrumb} lang={lang} />
                </div>
                <div className="page-content">
                    {played &&
                        menuRepository && (
                            <PagePlaybackOverlay
                                currentPage={page}
                                lang={lang}
                                menuRepository={menuRepository}
                                onReplayRequest={this.handleReplayRequest}
                                onPageRequest={this.props.onPageChangeRequest}
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
                            {audioProxy ? (
                                <div className="panel-audio-subs">
                                    <VideoProxyPlayer
                                        ref={this.mainPlayerRef}
                                        style={{ width: '100%', height: '100%' }}
                                        crossOrigin={'anonymous'}
                                        defaultSubtitleLang={defaultSubtitleLang}
                                        subtitleVisibility={subtitleVisibility}
                                        disablePoster={true}
                                        videoProxy={audioProxy}
                                        playing={this.state.isPlaying}
                                        onRateChange={this.handleRateChange}
                                        onPlaybackChange={this.handlePlaybackChange}
                                        onEnded={this.onEnded}
                                        controlBarProps={controlBarProps}
                                    />
                                </div>
                            ) : (
                                <ControlBar {...controlBarProps} />
                            )}
                        </div>
                    ) : (
                        <div className="page-single-video-layout">
                            <div className="autoscale-video-container">
                                <div className="autoscale-video-wrapper autoscale-video-content">
                                    <VideoProxyPlayer
                                        ref={this.mainPlayerRef}
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
                                        controlBarProps={controlBarProps}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /**
     * Return the main player media player (audio/video)
     */
    private getMainVideoPlayer(): VideoPlayer | null {
        if (this.mainPlayerRef.current) {
            return this.mainPlayerRef.current.getVideoPlayer();
        }
        return null;
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
            const player = this.getMainVideoPlayer();
            if (player) {
                player.replay();
            }
            const newState = {
                ...prevState,
                played: false,
            };
            return newState;
        });
    };

    private handlePlayNextRequest = (): void => {
        if (this.state.nextPage !== undefined && this.props.onPageChangeRequest !== undefined) {
            this.props.onPageChangeRequest(this.state.nextPage.pageId);
        }
    };

    private handlePlayPreviousRequest = (): void => {
        if (this.state.previousPage !== undefined && this.props.onPageChangeRequest !== undefined) {
            this.props.onPageChangeRequest(this.state.previousPage.pageId);
        }
    };

    private handleRateChange = (playbackRate: number) => {
        this.setState({
            playbackRate: playbackRate,
        });
    };

    private onEnded = (e: SyntheticEvent<HTMLVideoElement>) => {
        if (this.props.onPagePlayed) {
            this.props.onPagePlayed();
        } else {
            if (this.state.isSilent) {
                // make a loop
                const player = this.getMainVideoPlayer();
                if (player) {
                    player.replay();
                }
            } else {
                this.setState({
                    played: true,
                });
            }
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

    private getPrevAndNextPageEntities(pageId: string): PrevAndNextPageEntities {
        const { menuRepository } = this.props;
        if (menuRepository === undefined) {
            return {};
        }
        return menuRepository.getPrevAndNextPageEntityMenu(pageId, this.props.lang);
    }

    private getMenuBreadcrumb(pageId: string): MenuSectionProps[] {
        const { menuRepository } = this.props;
        if (menuRepository === undefined) {
            return [];
        }
        return menuRepository.getPageBreadcrumb(pageId, this.props.lang);
    }
}

export default translate()(Page);
