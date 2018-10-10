import React, { SourceHTMLAttributes, SyntheticEvent, VideoHTMLAttributes } from 'react';
import { Omit } from 'utility-types';
import equal from 'fast-deep-equal';
import { hideAllTextTracks } from '@src/components/player/controls/utils/video-texttrack-helpers';
import HTMLVideoTrackManager from '@src/components/player/track/html-video-track-manager';

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
    //onEnded?: (e: Event) => void;
    onEnded?: (e: SyntheticEvent<HTMLVideoElement>) => void;
};

export type VideoPlayerProps = {
    srcs?: VideoSourceProps[];
    tracks?: TextTrackProps[];
    playbackRate: number;
    autoPlay?: boolean;
    playing: boolean;
    forwardRef?: React.RefObject<HTMLVideoElement>;
} & Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'onEnded' | 'autoPlay'> &
    VideoActions;

export type VideoPlayerState = {
    initialized: boolean;
    playing?: boolean;
};

const defaultProps = {
    playbackRate: 1,
    playsInline: true,
    autoPlay: false,
    playing: false,
    loop: false,
};

const defaultState = {
    initialized: false,
};

class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {
    static defaultProps = defaultProps;
    readonly state = defaultState;
    private videoRef!: React.RefObject<HTMLVideoElement>;
    private listenersRegistered = false;
    private trackManager!: HTMLVideoTrackManager;

    constructor(props: VideoPlayerProps) {
        super(props);
        if (this.props.forwardRef) {
            this.videoRef = this.props.forwardRef;
        } else {
            this.videoRef = React.createRef<HTMLVideoElement>();
        }
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
            this.initAutoPlay();
        } else {
            console.log('MOUNT BUT NO VIDEOREF');
            throw Error('Registering listeners failed, video element is null');
        }
    }

    componentDidUpdate() {
        if (this.videoRef.current !== null) {
            const videoEl = this.videoRef.current;
            this.trackManager = new HTMLVideoTrackManager(videoEl);
            // Sources have been reloaded or text tracks have been changed
            videoEl.load();
            this.initAutoPlay();
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

        // Let's handle those ones without React.

        if (this.props.playbackRate !== nextProps.playbackRate) {
            this.setPlaybackRate(nextProps.playbackRate);
            shouldUpdate = false;
        }

        if (this.props.playbackRate !== nextProps.playbackRate) {
            // Let's handle that without React.
            this.setPlaybackRate(nextProps.playbackRate);
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
            videoEl.playbackRate = playbackRate;
        }
    }

    initPlayingState(playing: boolean): void {
        if (playing) {
            this.play();
        } else {
            const videoEl = this.getVideoElement();
            if (videoEl !== null) {
                videoEl.pause();
            }
        }
    }

    play(onFullfilled?: () => void, onError?: (errorMsg: string) => void): void {
        const videoEl = this.getVideoElement();
        if (videoEl !== null) {
            const playPromise = videoEl.play();
            playPromise
                .then(() => {
                    if (onFullfilled) {
                        onFullfilled();
                    }
                })
                .catch((errorMsg: string) => {
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
            // OMIT those props
            srcs,
            tracks,
            playbackRate,
            //            autoPlay,
            playing,
            // onEnded,
            // The rest in mediaProps
            ...mediaProps
        } = this.props;

        //const key = srcs && srcs.length > 0 ? srcs[0].src : '';

        return (
            <video
                onLoadedMetadata={this.onLoadedMetadata}
                ref={this.videoRef}
                {...mediaProps}
                {...(this.props.playsInline ? { 'webkit-playsinline': 'webkit-playsinline' } : {})}
                //              {...(playing || autoPlay) ? { autoPlay: true } : {}}
            >
                {srcs && srcs.map((s, idx) => <source key={`${s.src}-${idx}`} {...s} />)}
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
        );
    }

    /**
     * Managing text tracks manually, too much bugs in browsers implementaion
     */
    private onLoadedMetadata = (e: SyntheticEvent<HTMLVideoElement>) => {
        const video = e.currentTarget;

        // As a workaround for Firefox, let's remove old tracks
        // before adding the new ones. Letting react do
        // the job does not seems to work properly
        //hideAllTextTracks(video);
        this.trackManager.removeVideoTrackNodes();

        if (this.props.tracks) {
            this.trackManager.appendTrackNodes(this.props.tracks);
        }
    };

    private registerVideoListeners(video: HTMLVideoElement, skipOnRegistered: boolean = true): void {
        if (skipOnRegistered && this.listenersRegistered) {
            return;
        }
        const { onEnded } = this.props;
        if (onEnded) {
            //video.addEventListener('ended', onEnded);
        }
        video.addEventListener('play', this.updatePlayingState);
        this.listenersRegistered = true;
    }

    private unregisterVideoListeners(video: HTMLVideoElement): void {
        if (this.listenersRegistered) {
            //video.removeEventListener('ratechange', this.updateVolumeState);
            video.removeEventListener('play', this.updatePlayingState);
            this.listenersRegistered = false;
        }
    }

    private initAutoPlay() {
        if (this.props.autoPlay || this.props.playing) {
            this.play(undefined, errorMsg => {
                console.warn('Cannot autoplay video:' + errorMsg);
            });
        }
    }

    /**
     * Update local state with playing status
     * @param {Event<HTMLVideoElement>} e
     */
    private updatePlayingState = (e: Event): void => {
        const videoEl = e.currentTarget as HTMLVideoElement;
        if (videoEl) {
            const isPlaying = VideoPlayer.isVideoPlaying(videoEl);
            this.setState({
                ...this.state,
                playing: isPlaying,
            });
        } else {
            console.warn('Cannot update playingState, no "event.target" available', e);
        }
    };
}

export default VideoPlayer;
