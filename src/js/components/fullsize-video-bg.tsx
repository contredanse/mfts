import * as React from 'react';
import SimpleVideo from '@src/components/simple-video';
import { VideoSourcesProps } from './simple-video';
import './fullsize-bg-video.scss';

type FullsizeVideoBgProps = {
    videoSrcs: VideoSourcesProps;
    videoSrcBaseUrl?: string;
    playbackRate?: number;
};

type FullsizeVideoBgState = {};

const defaultProps = {
    playbackRate: 1,
} as FullsizeVideoBgProps;

class FullsizeVideoBg extends React.PureComponent<FullsizeVideoBgProps, FullsizeVideoBgState> {
    static readonly defaultProps: FullsizeVideoBgProps = defaultProps;
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
                    <SimpleVideo
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
