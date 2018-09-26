import { VideoHTMLAttributes } from 'react';
import * as React from 'react';

export type VideoSourcesProps = Array<{ src: string; type: string }>;

export type SimpleVideoProps = {
    srcs?: VideoSourcesProps;
    playbackRate: number;
} & VideoHTMLAttributes<HTMLVideoElement>;

const defaultProps = {
    playbackRate: 1,
} as SimpleVideoProps;

class BasicVideoPlayer extends React.Component<SimpleVideoProps, {}> {
    static readonly defaultProps: SimpleVideoProps = defaultProps;

    protected videoRef!: React.RefObject<HTMLVideoElement>;

    constructor(props: SimpleVideoProps) {
        super(props);
        this.videoRef = React.createRef<HTMLVideoElement>();
    }

    componentDidMount() {
        const videoEl = this.getVideoElement();
        this.setPlaybackRate(this.props.playbackRate);
    }

    shouldComponentUpdate(nextProps: SimpleVideoProps): boolean {
        if (this.props.playbackRate !== nextProps.playbackRate) {
            this.setPlaybackRate(nextProps.playbackRate);
            return false;
        }
        return true;
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
        const { srcs, playbackRate, ...mediaProps } = this.props;
        return (
            <video ref={this.videoRef} {...mediaProps}>
                {srcs && srcs.map((v, idx) => <source key={idx} src={v.src} type={v.type} />)}
                {this.props.children}
            </video>
        );
    }
}

export default BasicVideoPlayer;
