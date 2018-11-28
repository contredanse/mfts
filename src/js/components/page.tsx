import React, { SyntheticEvent } from 'react';

//import { withNamespaces, WithNamespaces } from 'react-i18next';

import './page.scss';

import PageProxy from '@src/models/proxy/page-proxy';

import { ControlBarProps } from '@src/components/player/controls/control-bar';
import PanelMultiVideo from '@src/components/panel-multi-video';
import VideoProxyPlayer from '@src/components/player/data-proxy-player';
import MenuRepository, { MenuSectionProps, PrevAndNextPageEntities } from '@src/models/repository/menu-repository';
import PageBreadcrumb from '@src/components/page-breadcrumb';
import TrackVisibilityHelper, { TrackVisibilityMode } from '@src/components/player/track/track-visibility-helper';
import EventListener from 'react-event-listener';
import PagePlaybackOverlay from '@src/components/page-playback-overlay';
import VideoPlayer from '@src/components/player/video-player';
import AppBarPortal from '@src/components/navigation/app-bar-portal';
import ConnectedControlBar from '@src/components/player/controls/connected-control-bar';
import PagePanelAudio from '@src/components/page-panel-audio';

export type PageProps = {
    pageProxy: PageProxy;
    menuRepository?: MenuRepository;
    lang: string;
    onNewRouteRequest?: (routeSpec?: string) => void;
    onPagePlayed?: () => void;
};

type PageStateFromPageProxy = {
    isSilent: boolean;
    autoLoop: boolean;
    loopIterations?: number;
    activateSpeedControls: boolean;
    isMultipleVideoContent: boolean;
    breadcrumb: MenuSectionProps[];
    previousPage?: PageProxy;
    nextPage?: PageProxy;
};

export type PageState = {
    currentLoopIteration: number;
    played: boolean;
    currentTime: number;
    isPlaying: boolean;
    playbackRate: number;
} & PageStateFromPageProxy;

const defaultPageState: PageState = {
    isSilent: false,
    autoLoop: false,
    loopIterations: undefined,
    currentLoopIteration: 1,
    activateSpeedControls: false,
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
        const { pageProxy } = this.props;
        this.state = {
            ...defaultPageState,
            ...this.createStateFromPageData(pageProxy),
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
            this.setState({
                ...this.createStateFromPageData(pageProxy),
                isPlaying: true,
                played: false,
            });
        }
    }

    createStateFromPageData(pageProxy: PageProxy): PageStateFromPageProxy {
        const { pageId } = pageProxy;
        const { previousPage, nextPage } = this.getPrevAndNextPageEntities(pageId);
        return {
            isSilent: pageProxy.isSilent(),
            autoLoop: pageProxy.isAutoloop(),
            loopIterations: pageProxy.getNumberOfLoopIterations(),
            isMultipleVideoContent: pageProxy.isMultiVideoContent(),
            activateSpeedControls: true, // force for now //pageProxy.shouldHaveSpeedControls(),
            breadcrumb: this.getMenuBreadcrumb(pageId),
            previousPage: previousPage,
            nextPage: nextPage,
        };
    }

    render() {
        const { pageProxy: page, lang, menuRepository } = this.props;

        const pageTitle = page.getTitle(lang);

        const defaultSubtitleLang = lang;
        const subtitleVisibility = this.getSubtitleVisibility();

        const { isMultipleVideoContent, played, autoLoop } = this.state;

        const audioProxy = page.getAudioProxy();

        const controlBarProps: ControlBarProps = {
            lang: lang,
            playbackRate: this.state.playbackRate,
            enableSpeedControl: this.state.activateSpeedControls,
            mediaIsSilent: this.state.isSilent,
            disableButtonSpaceClick: true,
            idleMonitorTimeout: 1500,
            enableNextControl: true,
            enablePrevControl: this.state.previousPage !== undefined,
            onNextLinkPressed: this.handlePlayNextRequest,
            onPreviousLinkPressed: this.handlePlayPreviousRequest,
            onRateChangeRequest: this.handleRateChange,
        };

        console.log('RERENDER PAGE');

        return (
            <div className="page-container">
                <EventListener target="window" onKeyPress={this.handleGlobalKeyPress} />
                <AppBarPortal>
                    <PageBreadcrumb title={pageTitle} sections={this.state.breadcrumb} lang={lang} />
                </AppBarPortal>
                <div className="page-content">
                    {played && menuRepository && (
                        <PagePlaybackOverlay
                            currentPage={page}
                            lang={lang}
                            menuRepository={menuRepository}
                            onReplayRequest={this.handleReplayRequest}
                            onPageRequest={(pageId: string) => {
                                this.gotoPage(pageId);
                            }}
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
                                <PagePanelAudio
                                    audioProxy={audioProxy}
                                    subtitleLang={defaultSubtitleLang}
                                    subtitleVisibility={subtitleVisibility}
                                    playing={this.state.isPlaying}
                                    onEnded={this.onEnded}
                                    handlePlaybackChange={this.handlePlaybackChange}
                                    playerRef={this.mainPlayerRef}
                                    controlBarProps={controlBarProps}
                                />
                            ) : (
                                <ConnectedControlBar {...controlBarProps} />
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
                                        loop={autoLoop}
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

    private gotoPage(pageId: string) {
        if (this.props.onNewRouteRequest) {
            this.props.onNewRouteRequest(`/{lang}/page/${pageId}`);
        }
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
            this.setState(prevState => ({
                isPlaying: !prevState.isPlaying,
            }));
        }
    };

    private handlePlaybackChange = (isPlaying: boolean) => {
        this.setState((prevState: PageState) => {
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
        this.setState((prevState: PageState) => {
            const player = this.getMainVideoPlayer();
            if (player) {
                player.replay();
            }
            const newState = {
                ...prevState,
                currentLoopIteration: 1,
                played: false,
            };
            return newState;
        });
    };

    private handlePlayNextRequest = (): void => {
        if (this.state.nextPage !== undefined) {
            this.gotoPage(this.state.nextPage.pageId);
        } else if (this.props.onNewRouteRequest) {
            this.props.onNewRouteRequest();
        }
    };

    private handlePlayPreviousRequest = (): void => {
        if (this.state.previousPage !== undefined) {
            this.gotoPage(this.state.previousPage.pageId);
        } else if (this.props.onNewRouteRequest) {
            this.props.onNewRouteRequest();
        }
    };

    private handleRateChange = (playbackRate: number) => {
        this.setState({
            playbackRate: playbackRate,
        });
    };

    private onEnded = (e?: SyntheticEvent<HTMLVideoElement>) => {
        if (this.props.onPagePlayed) {
            this.props.onPagePlayed();
        } else {
            const { isSilent, autoLoop, loopIterations, currentLoopIteration } = this.state;
            if (loopIterations) {
                if (currentLoopIteration >= loopIterations) {
                    this.setState({
                        played: true,
                    });
                } else {
                    const player = this.getMainVideoPlayer();
                    if (player) {
                        player.replay();
                    }
                    this.setState(prevState => ({
                        currentLoopIteration: prevState.currentLoopIteration + 1,
                    }));
                }
            } else if (isSilent || autoLoop) {
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

export default Page;
