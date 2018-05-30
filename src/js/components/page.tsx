import * as React from 'react';
import './page.scss';
import { PageOverlay } from '@src/components/page-overlay';
import PageEntity from '@src/models/entity/page-entity';

import MediaPlayer, {
    HTMLMediaMetadata,
    MediaPlayerActions,
    MediaPlayerEffects,
} from '@src/components/player/media-player';
import MediaPlayerControlBar from '@src/components/player/media-player-controlbar';
import PageVideoGroup from '@src/components/page-video-group';
import PageAudioPlayer from '@src/components/page-audio-player';

export type PlaybackState = {
    currentTime: number;
    isPlaying: boolean;
    duration: number;
    videoWidth: number;
    videoHeight: number;
    playbackRate: number;
    isMetadataLoaded: boolean;
};

export type PageContextProps = {
    effects: MediaPlayerEffects;
    actions: MediaPlayerActions;
    state: PlaybackState;
};

export type PageProps = {
    pageEntity: PageEntity;
    lang: string;
};

export type PageState = {
    playbackState: PlaybackState;
};

export default class Page extends React.Component<PageProps, PageState> {
    readonly state: PageState;
    playerRef!: React.RefObject<MediaPlayer>;
    audioPlayer!: React.RefObject<PageAudioPlayer>;

    pageContext!: React.Context<PageContextProps>;
    mediaPlayerActions!: MediaPlayerActions;
    mediaPlayerEffects!: MediaPlayerEffects;

    constructor(props: PageProps) {
        super(props);

        const playerInitialState: PlaybackState = {
            currentTime: 0,
            isPlaying: false,
            duration: 0,
            playbackRate: 1,
            videoWidth: 0,
            videoHeight: 0,
            isMetadataLoaded: false,
        };

        this.state = {
            playbackState: playerInitialState,
        };

        this.initMediaPlayerActions();
        this.initMediaPlayerEffects();
        this.initContext();

        this.playerRef = React.createRef<MediaPlayer>();
        this.audioPlayer = React.createRef<PageAudioPlayer>();
    }

    render() {
        const { pageEntity: page } = this.props;

        const videos = page.getVideos(this.props.lang);
        const audio = page.getAudioEntity();

        // Warning this is an hack...
        // - audio/mp3 works on desktops but not on mobile
        // - video/mp4 works on desktops
        const audioMimeType = 'video/mp4';

        const PageContextProvider = this.pageContext.Provider;
        const PageContextConsumer = this.pageContext.Consumer;

        return (
            <PageOverlay closeButton={false}>
                <div className="page-wrapper">
                    <PageContextProvider
                        value={{
                            effects: this.mediaPlayerEffects,
                            actions: this.mediaPlayerActions,
                            state: this.state.playbackState,
                        }}
                    >
                        <div className="page-container">
                            <div className="page-header">Page: {page.pageId}</div>
                            <div className="page-content">
                                {page.countVideos() > 1 ? (
                                    <div className="page-multi-video-layout">
                                        <div className="page-video-wall">
                                            <PageVideoGroup
                                                videos={videos}
                                                pageEntity={page}
                                                playbackState={{
                                                    playing: this.state.playbackState.isPlaying,
                                                    playbackRate: this.state.playbackState.playbackRate,
                                                }}
                                            />
                                        </div>
                                        {audio && (
                                            <div className="page-audio-subs">
                                                <PageAudioPlayer
                                                    ref={this.audioPlayer}
                                                    audio={audio}
                                                    onPlay={() => {
                                                        this.updatePlaybackState({
                                                            isPlaying: true,
                                                        });
                                                    }}
                                                    onPause={() => {
                                                        this.updatePlaybackState({
                                                            isPlaying: false,
                                                        });
                                                    }}
                                                    onDuration={(duration: number) => {
                                                        this.updatePlaybackState({
                                                            duration: duration,
                                                        });
                                                    }}
                                                    width="100%"
                                                    height="100%"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="page-single-video-layout">
                                        <PageContextConsumer>
                                            {({ effects }) => (
                                                <MediaPlayer
                                                    ref={this.playerRef}
                                                    crossOrigin="anonymous"
                                                    autoPlay={true}
                                                    effects={effects}
                                                >
                                                    {page
                                                        .getFirstVideo()!
                                                        .getSources()
                                                        .map((source, idx) => (
                                                            <source
                                                                key={`video-${idx}`}
                                                                src={source.getSource()}
                                                                type={source.getHtmlVideoTypeValue()}
                                                            />
                                                        ))}
                                                    {page
                                                        .getFirstVideo()!
                                                        .getAllTracks()
                                                        .map((audioTrack, idx) => {
                                                            //console.log('audioTrack', audioTrack);
                                                            return (
                                                                <track
                                                                    key={`audio-${idx}`}
                                                                    label={audioTrack.lang}
                                                                    kind="subtitles"
                                                                    srcLang={audioTrack.lang}
                                                                    src={audioTrack.src}
                                                                    {...(this.props.lang === audioTrack.lang
                                                                        ? { default: true }
                                                                        : {})}
                                                                />
                                                            );
                                                        })}
                                                </MediaPlayer>
                                            )}
                                        </PageContextConsumer>
                                    </div>
                                )}
                            </div>
                            <div className="page-footer">
                                <PageContextConsumer>
                                    {({ state, actions }) => {
                                        // Check which player (audio/video) instance will
                                        // be managed by the control bar

                                        let mediaRef: HTMLVideoElement | null = null;
                                        if (this.audioPlayer.current) {
                                            mediaRef = this.audioPlayer.current.getHTMLVideoElement();
                                        } else if (this.playerRef.current) {
                                            mediaRef = this.playerRef.current.getVideoElement();
                                        }

                                        return (
                                            <MediaPlayerControlBar
                                                {...(mediaRef ? { videoEl: mediaRef } : {})}
                                                actions={actions}
                                                duration={state.duration}
                                                currentTime={state.currentTime}
                                                isPlaying={state.isPlaying}
                                                playbackRate={state.playbackRate}
                                            />
                                        );
                                    }}
                                </PageContextConsumer>
                            </div>
                        </div>
                    </PageContextProvider>
                </div>
            </PageOverlay>
        );
    }

    private initMediaPlayerActions(): void {
        this.mediaPlayerActions = {
            // Actions
            pause: () => {
                console.log('calling pause');
                /*
                if (this.playerRef.current) {
                    this.playerRef.current.pause();
                }*/
                this.setState((prevState, prevProps) => {
                    const newState = {
                        prevState,
                        ...{ playbackState: { ...prevState.playbackState, isPlaying: false } },
                    };
                    return newState;
                });
            },
            play: () => {
                /*
                console.log('play action');
                if (this.playerRef.current) {
                    this.playerRef.current.play();
                }*/

                this.setState((prevState, prevProps) => {
                    const newState = {
                        prevState,
                        ...{ playbackState: { ...prevState.playbackState, isPlaying: true } },
                    };
                    return newState;
                });
            },
            setPlaybackRate: playbackRate => {
                if (this.playerRef.current) {
                    this.playerRef.current.getVideoElement().playbackRate = playbackRate;
                }
            },
            setCurrentTime: time => {
                if (this.playerRef.current) {
                    this.playerRef.current.getVideoElement().currentTime = time;
                }
            },
        };
    }

    private initMediaPlayerEffects(): void {
        this.mediaPlayerEffects = {
            updateCurrentTime: (currentTime: number) => {
                /*
                this.updatePlaybackState({
                    currentTime: currentTime,
                });*/
            },
            updateMetadata: (metadata: HTMLMediaMetadata) => {
                const { duration, videoWidth, videoHeight } = metadata;
                this.updatePlaybackState({
                    duration: duration,
                    videoWidth: videoWidth,
                    videoHeight: videoHeight,
                });
            },
            updatePlaybackRate: (playbackRate: number) => {
                this.updatePlaybackState({
                    playbackRate: playbackRate,
                });
            },
            updatePlayingState: (isPlaying: boolean) => {
                this.updatePlaybackState({
                    isPlaying: isPlaying,
                });
            },
        };
    }
    private initContext(): void {
        this.pageContext = React.createContext<PageContextProps>({
            state: this.state.playbackState,
        } as PageContextProps);
    }

    private updatePlaybackState(deltaState: Partial<PlaybackState>): void {
        this.setState((prevState: PageState) => {
            return { ...prevState, playbackState: { ...prevState.playbackState, ...deltaState } };
        });
    }
}
