import React, { SourceHTMLAttributes, SyntheticEvent, VideoHTMLAttributes } from 'react';
import { Omit, Overwrite } from 'utility-types';
import equal from 'fast-deep-equal';
import HTMLVideoTrackManager from '@src/components/player/track/html-video-track-manager';
import { hideAllTextTracks } from '@src/components/player/controls/utils/video-texttrack-helpers';
import ControlBar, { ControlBarProps } from '@src/components/player/controls/control-bar';
import ConnectedControlBar from '@src/components/player/controls/connected-control-bar';

export type VideoSourceProps = SourceHTMLAttributes<HTMLSourceElement>;
export type TextTrackKind = 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
export type TextTrackProps = {
    kind: TextTrackKind;
    src: string;
    srcLang: string;
    label: string;
    default?: boolean;
};
export type VideoActions = {
    onEnded?: (e: SyntheticEvent<HTMLVideoElement>) => void;
    onCanPlay?: (e: SyntheticEvent<HTMLVideoElement>) => void;
    onRateChange?: (playbackRate: number) => void;
    onPlaybackChange?: (isPlaying: boolean) => void;
    onDebug?: (message: string) => void;
    onError?: (error: { code: number; message: string }) => void;
};

export type VideoPlayerProps = {
    srcs?: VideoSourceProps[];
    tracks?: TextTrackProps[];
    playbackRate: number;
    autoPlay?: boolean;
    playing: boolean;
    playsInline?: boolean;
    poster?: string;
    width?: number | string;
    height?: number | string;
    controls?: boolean;
    controlsList?: string;
    crossOrigin?: string;
    loop?: boolean;
    muted?: boolean;
    preload?: string;
    disableContextMenu?: boolean;
    controlBarProps?: ControlBarProps;
    playbackRateAutoMute?: { min: number; max: number };
} & Overwrite<
    // Let's overwrite video actions...
    // Let's remove 'src' and 'autoplay'
    Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'autoPlay'>,
    VideoActions
> &
    // Let's add our videos actions
    VideoActions;

export type VideoPlayerState = {
    playing?: boolean;
    refLoaded: boolean;
};

const defaultProps = {
    playbackRate: 1,
    playsInline: true,
    autoPlay: false,
    playing: false,
    loop: false,
    disableContextMenu: false,
    playbackRateAutoMute: {
        min: 0.5,
        max: 1.5,
    },
};

const defaultState = {
    refLoaded: false,
} as VideoPlayerState;

class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {
    static defaultProps = defaultProps;
    readonly state = defaultState;
    private readonly videoRef!: React.RefObject<HTMLVideoElement>;
    private readonly controlBarRef!: React.RefObject<ControlBar>;
    private listenersRegistered = false;
    private trackManager!: HTMLVideoTrackManager;

    private inAutoPlayInit = false;

    constructor(props: VideoPlayerProps) {
        super(props);
        this.videoRef = React.createRef<HTMLVideoElement>();
        this.controlBarRef = React.createRef<ControlBar>();
    }

    /**
     * Utility to get playing status on an existing video element
     */
    static isVideoPlaying(videoEl: HTMLVideoElement): boolean {
        return !videoEl.paused && !videoEl.ended && videoEl.readyState > 2;
    }

    componentDidMount() {
        if (this.videoRef.current !== null) {
            this.trackManager = new HTMLVideoTrackManager(this.videoRef.current);
            this.registerVideoListeners(this.videoRef.current);
            // Set default playback props

            this.setPlaybackRate(this.props.playbackRate);

            if (!this.state.refLoaded) {
                this.setState({
                    refLoaded: true,
                });
            }
        } else {
            console.error('Error, registering listeners failed, video element is null');
        }
    }

    componentDidUpdate() {
        const videoEl = this.videoRef.current;
        if (videoEl !== null) {
            this.trackManager = new HTMLVideoTrackManager(videoEl);
            // Sources have been reloaded or text tracks have been changed
            videoEl.load();

            if (!this.props.playing) {
                videoEl.pause();
            }
        }
    }

    componentWillUnmount() {
        if (this.videoRef.current !== null) {
            this.unregisterVideoListeners(this.videoRef.current);
        }
    }

    shouldComponentUpdate(nextProps: VideoPlayerProps, nextState: VideoPlayerState): boolean {
        // By default we never update !!!
        let shouldUpdate = false;

        // React ref available
        if (!this.state.refLoaded && nextState.refLoaded) {
            return true;
        }

        // Let's deep check controlbarprops
        /*
        if (!equal(nextProps.controlBarProps, this.props.controlBarProps)) {
            console.log('REFLOADED MISSING', nextProps.controlBarProps, this.props.controlBarProps);
            shouldUpdate = true;
        }
        */

        // Let's handle those ones without React.
        if (this.props.playbackRate !== nextProps.playbackRate) {
            this.setPlaybackRate(nextProps.playbackRate);
            shouldUpdate = false;
        }

        if (this.props.playing !== nextProps.playing) {
            // Let's handle that without React.
            if (nextProps.playing) {
                this.play();
            } else {
                this.pause();
            }
            shouldUpdate = false;
        }

        // Let's deep check src and tracks to see if we need
        // to recreate the video key
        if (!equal(nextProps.srcs, this.props.srcs) || !equal(nextProps.tracks, this.props.tracks)) {
            shouldUpdate = true;
        }

        return shouldUpdate;
    }

    setPlaybackRate(playbackRate: number): void {
        const videoEl = this.getVideoElement();

        if (videoEl !== null) {
            if (!this.props.muted && this.props.playbackRateAutoMute) {
                const { min, max } = this.props.playbackRateAutoMute;
                if (playbackRate > max || playbackRate < min) {
                    videoEl.muted = true;
                } else {
                    videoEl.muted = false;
                }
            }
            videoEl.playbackRate = playbackRate;
        }
    }

    pause(): void {
        const videoEl = this.getVideoElement();
        if (videoEl !== null) {
            videoEl.pause();
            this.setState({
                playing: false,
            });
        }
    }

    replay(onFullfilled?: () => void, onError?: (errorMsg: string) => void): void {
        const videoEl = this.getVideoElement();
        if (videoEl !== null) {
            videoEl.currentTime = 0;
            this.play(onFullfilled, onError);
        }
    }

    play(onFullfilled?: () => void, onError?: (errorMsg: string) => void): void {
        const videoEl = this.getVideoElement();
        if (videoEl !== null) {
            const playPromise = videoEl.play();
            playPromise
                .then(() => {
                    this.setState({
                        playing: true,
                    });
                    if (onFullfilled) {
                        onFullfilled();
                    }
                })
                .catch((errorMsg: string) => {
                    this.setState({
                        playing: false,
                    });
                    if (onError) {
                        onError(errorMsg);
                    }
                });
        }
    }

    getVideoElement(): HTMLVideoElement | null {
        return this.videoRef.current;
    }

    render() {
        const {
            // DEREFERENCE those props
            srcs,
            tracks,
            playbackRate,
            autoPlay,
            playing,
            controlBarProps,
            playbackRateAutoMute,
            // DEREFERENCE those actions
            onEnded,
            onCanPlay,
            onRateChange,
            onPlaybackChange,
            onDebug,
            onError,
            disableContextMenu,
            // The rest in mediaProps
            ...mediaProps
        } = this.props;

        return (
            <>
                <video
                    ref={this.videoRef}
                    onLoadedMetadata={this.handleOnLoadedMetadata}
                    onCanPlay={this.handleOnCanPlay}
                    onEnded={this.handleOnEnded}
                    onPause={this.handleOnPause}
                    onPlay={this.handleOnPlay}
                    onContextMenu={this.handleOnContextMenu}
                    onRateChange={this.handleOnRateChange}
                    onError={this.handleOnError}
                    autoPlay={autoPlay}
                    {...mediaProps}
                    {...(this.props.playsInline ? { 'webkit-playsinline': 'webkit-playsinline' } : {})}
                    // {...(playing || autoPlay) ? { autoPlay: true } : {}}
                >
                    {srcs &&
                        srcs.map((s, idx) => <source onError={this.handleOnError} key={`${s.src}-${idx}`} {...s} />)}
                    {/*
                // This would be so easy, but subsequent changes in tracks will
                // be ignored by firefox. See the workaround onLoadedMetaData function
                {tracks && tracks.map((t, idx) => {
                    return null;
                  return (
                      <track id={`${t.src}-${idx}`} key={`${t.src}-${idx}`} {...t}/>
                  );
                })}
                */}
                </video>
                {this.state.refLoaded && this.props.controlBarProps && (
                    <ConnectedControlBar videoEl={this.videoRef.current} {...this.props.controlBarProps} />
                )}
            </>
        );
    }

    private handleOnContextMenu = (e: SyntheticEvent<HTMLVideoElement>): void => {
        const { disableContextMenu, onContextMenu } = this.props;
        if (disableContextMenu) {
            e.preventDefault();
        } else if (onContextMenu) {
            e.preventDefault();
            e.persist();
            onContextMenu(e.nativeEvent as any);
        }
    };

    private handleOnPlay = (e: SyntheticEvent<HTMLVideoElement>) => {
        if (this.props.onDebug) {
            this.props.onDebug('handlePlay');
        }

        // Assume playing if event is null/undefined
        const isPlaying = e ? VideoPlayer.isVideoPlaying(e.currentTarget) : true;

        this.setState({
            playing: isPlaying,
        });
        if (this.props.onPlaybackChange) {
            this.props.onPlaybackChange(true);
        }
        if (this.props.onPlay) {
            this.props.onPlay(e);
        }
    };

    private handleOnCanPlay = (e: SyntheticEvent<HTMLVideoElement>) => {
        if (this.props.onDebug) {
            this.props.onDebug('handleCanPlay');
        }
        this.initAutoPlay();
        this.setPlaybackRate(this.props.playbackRate);
        if (this.props.onCanPlay) {
            this.props.onCanPlay(e);
        }
    };

    private handleOnPause = (e: SyntheticEvent<HTMLVideoElement>) => {
        if (this.props.onDebug) {
            this.props.onDebug('handleOnPause');
        }

        this.setState({
            playing: false,
        });
        if (this.props.onPlaybackChange) {
            this.props.onPlaybackChange(false);
        }
        if (this.props.onPause) {
            this.props.onPause(e);
        }
    };

    private handleOnEnded = (e: SyntheticEvent<HTMLVideoElement>) => {
        if (this.props.onDebug) {
            this.props.onDebug('handleOnEnded');
        }

        this.setState({
            playing: false,
        });
        if (this.props.onPlaybackChange) {
            this.props.onPlaybackChange(false);
        }
        if (this.props.onEnded) {
            this.props.onEnded(e);
        }
    };

    private handleOnRateChange = (e: SyntheticEvent<HTMLVideoElement>) => {
        if (this.props.onDebug) {
            this.props.onDebug('handleOnRateChange');
        }

        if (this.props.onRateChange) {
            const video = e.currentTarget as HTMLVideoElement;
            this.props.onRateChange(video.playbackRate);
        }
    };

    private handleOnError = (e: SyntheticEvent<HTMLVideoElement & HTMLSourceElement>) => {
        if (this.props.onDebug) {
            this.props.onDebug('handleError');
        }

        if (this.props.onError) {
            const video = e.currentTarget as HTMLVideoElement;
            const error = video.error ? video.error : { code: 999, message: 'Video error (undefined)' };
            console.warn('onError', error);
            this.props.onError(error);
        }
    };

    /**
     * Managing text tracks manually, too much bugs in browsers implementaion
     */
    private handleOnLoadedMetadata = (e: SyntheticEvent<HTMLVideoElement>) => {
        if (this.props.onDebug) {
            this.props.onDebug('handleHandleMetadata');
        }

        const video = e.currentTarget;

        // As a workaround for Firefox, let's remove old tracks
        // before adding the new ones. Letting react do
        // the job does not seems to work properly
        hideAllTextTracks(video);

        this.trackManager.removeVideoTrackNodes();

        if (this.props.tracks) {
            this.trackManager.appendTrackNodes(this.props.tracks);
        }
    };

    private initAutoPlay() {
        if (this.props.autoPlay || this.props.playing) {
            if (!this.inAutoPlayInit) {
                this.inAutoPlayInit = true;
                this.play(
                    () => {
                        this.inAutoPlayInit = false;
                    },
                    errorMsg => {
                        this.inAutoPlayInit = false;
                        console.warn('VideoPlayer: Cannot initAutoplay video:' + errorMsg);
                    }
                );
            } else {
                console.log('AUTOPLAY::CANNOT_START');
            }
        }
    }

    private registerVideoListeners(video: HTMLVideoElement, skipOnRegistered: boolean = true): void {
        if (this.props.onDebug) {
            this.props.onDebug('registerVideoListeners');
        }

        if (skipOnRegistered && this.listenersRegistered) {
            return;
        }
        this.listenersRegistered = true;
    }

    private unregisterVideoListeners(video: HTMLVideoElement): void {
        if (this.props.onDebug) {
            this.props.onDebug('unregisterVideoListeners');
        }
        this.listenersRegistered = false;
    }
}

export default VideoPlayer;
