import * as React from 'react';
import './page.scss';
import { PageOverlay } from '@src/components/page-overlay';
import PageEntity from '@src/model/entity/page-entity';
import VideoEntity from '@src/model/entity/video-entity';
import { ReactVideoPlayer } from '@src/components/react-video-player';
import {
    default as MediaPlayer,
    HTMLMediaMetadata,
    MediaPlayerActions,
    MediaPlayerEffects,
} from '@src/components/player/media-player';
import MediaPlayerControlBar from '@src/components/player/media-player-controlbar';

export type PlaybackState = {
    currentTime: number;
    isPlaying: boolean;
    duration: number;
    videoWidth: number;
    videoHeight: number;
    playbackRate: number;
    isMetadataLoaded: boolean;
};

type PageContextProps = {
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
                                            {videos.map(video => {
                                                return (
                                                    <VideoComp
                                                        key={video.videoId}
                                                        video={video}
                                                        loop={true}
                                                        autoPlay={false}
                                                    />
                                                );
                                            })}
                                        </div>
                                        {audio && (
                                            <div className="page-audio-subs">
                                                <video controls={true} crossOrigin="anonymous">
                                                    <source type={audioMimeType} src={audio.getSourceFile()} />
                                                    {audio.getAllTracks().map(audioTrack => {
                                                        return (
                                                            <track
                                                                key={audioTrack.src}
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
                                                </video>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="page-single-video-layout">
                                        <PageContextConsumer>
                                            {({ state, effects }) => (
                                                <MediaPlayer ref={this.playerRef} autoPlay={true} effects={effects}>
                                                    {page
                                                        .getFirstVideo()!
                                                        .getSources()
                                                        .map(source => (
                                                            <source
                                                                src={source.getSource()}
                                                                type={source.getHtmlVideoTypeValue()}
                                                            />
                                                        ))}
                                                </MediaPlayer>
                                            )}
                                        </PageContextConsumer>
                                    </div>
                                )}
                            </div>
                            <div className="page-footer">
                                <PageContextConsumer>
                                    {({ state, actions }) => (
                                        <MediaPlayerControlBar
                                            actions={actions}
                                            duration={state.duration}
                                            currentTime={state.currentTime}
                                            isPlaying={state.isPlaying}
                                            playbackRate={state.playbackRate}
                                        />
                                    )}
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
                this.playerRef.current!.getVideoElement().pause();
            },
            play: () => {
                this.playerRef.current!.getVideoElement().play();
            },
            setPlaybackRate: playbackRate => {
                console.log('mediaPlayerActions.setPlaybackRate', playbackRate);
                this.playerRef.current!.getVideoElement().playbackRate = playbackRate;
            },
            setCurrentTime: time => {
                this.playerRef.current!.getVideoElement().currentTime = time;
            },
        };
    }

    private initMediaPlayerEffects(): void {
        this.mediaPlayerEffects = {
            updateCurrentTime: (currentTime: number) => {
                this.updatePlaybackState({
                    currentTime: currentTime,
                });
            },
            updateMetadata: (metadata: HTMLMediaMetadata) => {
                console.log('UPDATING METADATA');
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

/**
 *
 */

export interface VideoCompProps {
    video: VideoEntity;
    autoPlay?: boolean;
    loop?: boolean;
    onEnd?: () => {};
}

export class VideoComp extends React.Component<VideoCompProps, {}> {
    static defaultProps: Partial<VideoCompProps> = {
        autoPlay: true,
        loop: false,
    };

    constructor(props: VideoCompProps) {
        super(props);
    }

    render() {
        const { video, autoPlay, loop, ...restProps } = this.props;
        const muted = true;
        const controls = true;

        const videoProps = {
            poster: video.getFirstCover() || '',
        };

        return (
            <div className="videocomp-container">
                <ReactVideoPlayer
                    muted={muted}
                    loop={loop}
                    controls={controls}
                    autoPlay={autoPlay}
                    webkit-playsinline="webkit-playsinline"
                    sourceUrl={video.getSources()[0].getSource()}
                />
                {/*
                {video.getSources().map((sourceEntity, idx) => {
                    return (
                        <source
                            key={idx}
                            src={sourceEntity.getSource()}
                            type={sourceEntity.getHtmlVideoTypeValue()}
                        />
                    );
                })}*/}
            </div>
        );
    }
}
