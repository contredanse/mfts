import React, { SourceHTMLAttributes, SyntheticEvent, TrackHTMLAttributes, VideoHTMLAttributes } from 'react';
import { Omit } from 'utility-types';

export type VideoSourcesProps = Array<SourceHTMLAttributes<HTMLSourceElement>>;
export type TracksSourcesProps = Array<TrackHTMLAttributes<HTMLTrackElement>>;

export type BasicVideoActions = {
    //onEnded?: (e: Event) => void;
    onEnded?: (e: SyntheticEvent<HTMLVideoElement>) => void;
};

export type BasicVideoProps = {
    srcs?: VideoSourcesProps;
    tracks?: TracksSourcesProps;
    playbackRate: number;
} & Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'onEnded'> &
    BasicVideoActions;

export type BasicVideoState = {
    listenersRegistered: boolean;
};

const defaultProps = {
    playbackRate: 1,
    playsInline: true,
};

class BasicVideoPlayer extends React.Component<BasicVideoProps, BasicVideoState> {
    static defaultProps = defaultProps;

    protected videoRef!: React.RefObject<HTMLVideoElement>;
    protected listenersRegistered = false;

    constructor(props: BasicVideoProps) {
        super(props);
        this.videoRef = React.createRef<HTMLVideoElement>();
    }

    componentDidMount() {
        this.setPlaybackRate(this.props.playbackRate);
        if (this.videoRef.current !== null) {
            this.registerVideoListeners(this.videoRef.current);
        } else {
            throw Error('Registering listeners failed, video element is null');
        }
    }

    componentWillUnmount() {
        if (this.videoRef.current !== null) {
            this.unregisterVideoListeners(this.videoRef.current);
        } else {
            throw Error('Unregistering listeners failed, video element is null');
        }
    }

    shouldComponentUpdate(nextProps: BasicVideoProps): boolean {
        let shouldUpdate = true;
        if (this.props.playbackRate !== nextProps.playbackRate) {
            this.setPlaybackRate(nextProps.playbackRate);
            shouldUpdate = shouldUpdate && false;
        }
        return shouldUpdate;
    }

    setPlaybackRate(playbackRate: number): void {
        const videoEl = this.getVideoElement();
        if (videoEl !== null) {
            videoEl.playbackRate = playbackRate;
        }
    }

    getVideoElement(): HTMLVideoElement | null {
        return this.videoRef.current;
    }

    render() {
        const {
            srcs,
            tracks,
            // Just to omit those props
            playbackRate,
            // onEnded,
            ...mediaProps
        } = this.props;
        return (
            <video
                ref={this.videoRef}
                {...mediaProps}
                {...(this.props.playsInline ? { 'webkit-playsinline': 'webkit-playsinline' } : {})}
            >
                {srcs && srcs.map((s, idx) => <source key={idx} {...s} />)}
                {tracks && tracks.map((t, idx) => <track key={idx} {...t} />)}
            </video>
        );
    }

    protected registerVideoListeners(video: HTMLVideoElement, skipOnRegistered: boolean = true): void {
        if (skipOnRegistered && this.listenersRegistered) {
            return;
        }
        const { onEnded } = this.props;
        if (onEnded) {
            //video.addEventListener('ended', onEnded);
        }
        //video.addEventListener('ratechange', this.updateVolumeState);
        this.listenersRegistered = true;
    }

    protected unregisterVideoListeners(video: HTMLVideoElement): void {
        if (this.listenersRegistered) {
            //video.removeEventListener('ratechange', this.updateVolumeState);
            this.listenersRegistered = false;
        }
    }
}

export default BasicVideoPlayer;
