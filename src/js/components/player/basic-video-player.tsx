import React, { SourceHTMLAttributes, TrackHTMLAttributes, VideoHTMLAttributes } from 'react';
import { Omit } from 'utility-types';

export type VideoSourcesProps = Array<SourceHTMLAttributes<HTMLSourceElement>>;
export type TracksSourcesProps = Array<TrackHTMLAttributes<HTMLTrackElement>>;

export type BasicVideoProps = {
    srcs?: VideoSourcesProps;
    tracks?: TracksSourcesProps;
    playbackRate: number;
} & Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'>;

const defaultProps = {
    playbackRate: 1,
    playsInline: true,
};

class BasicVideoPlayer extends React.Component<BasicVideoProps, {}> {
    static defaultProps = defaultProps;

    protected videoRef!: React.RefObject<HTMLVideoElement>;

    constructor(props: BasicVideoProps) {
        super(props);
        this.videoRef = React.createRef<HTMLVideoElement>();
    }

    componentDidMount() {
        const videoEl = this.getVideoElement();
        this.setPlaybackRate(this.props.playbackRate);
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
        const { srcs, tracks, playbackRate, ...mediaProps } = this.props;
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
}

export default BasicVideoPlayer;
