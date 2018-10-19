import * as React from 'react';
import VideoPlayer, { VideoSourceProps } from '../player/video-player';
import './fullsize-bg-video.scss';

type FullsizeVideoBgProps = {
    videoSrcs: VideoSourceProps[];
    videoSrcBaseUrl?: string;
    playbackRate?: number;
    loop?: boolean;
    onEnded?: () => void;
    autoPlay?: boolean;
};

type FullsizeVideoBgState = {};

const defaultProps = {
    playbackRate: 1,
    loop: true,
};

class FullsizeVideoBg extends React.PureComponent<FullsizeVideoBgProps, FullsizeVideoBgState> {
    static defaultProps = defaultProps;
    readonly state: FullsizeVideoBgState;

    constructor(props: FullsizeVideoBgProps) {
        super(props);
        this.state = {};
    }

    render() {
        const { videoSrcs, playbackRate, children, onEnded } = this.props;

        const loop = !onEnded && this.props.loop;

        return (
            <div className="fullsize-video-bg">
                <div className="fullsize-video-bg-inner">{children}</div>
                <div className="fullsize-video-bg-viewport">
                    <VideoPlayer
                        autoPlay={this.props.autoPlay}
                        muted={true}
                        playsInline={true}
                        loop={loop}
                        playbackRate={playbackRate}
                        srcs={videoSrcs}
                        onEnded={onEnded}
                    />
                </div>
            </div>
        );
    }
}

export default FullsizeVideoBg;
