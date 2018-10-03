import * as React from 'react';
import VideoPlayer, { VideoSourceProps } from '../player/video-player';
import './fullsize-bg-video.scss';

type FullsizeVideoBgProps = {
    videoSrcs: VideoSourceProps[];
    videoSrcBaseUrl?: string;
    playbackRate?: number;
};

type FullsizeVideoBgState = {};

const defaultProps = {
    playbackRate: 1,
};

class FullsizeVideoBg extends React.PureComponent<FullsizeVideoBgProps, FullsizeVideoBgState> {
    static defaultProps = defaultProps;
    readonly state: FullsizeVideoBgState;

    constructor(props: FullsizeVideoBgProps) {
        super(props);
        this.state = {};
    }

    render() {
        const { videoSrcs, playbackRate, children } = this.props;

        return (
            <div className="fullsize-video-bg">
                <div className="fullsize-video-bg-inner">{children}</div>
                <div className="fullsize-video-bg-viewport">
                    <VideoPlayer
                        autoPlay={true}
                        muted={true}
                        playsInline={true}
                        loop={true}
                        playbackRate={playbackRate}
                        srcs={videoSrcs}
                    />
                </div>
            </div>
        );
    }
}

export default FullsizeVideoBg;
