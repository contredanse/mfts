import * as React from 'react';
import "./video-player.scss";


export interface IVideoPlayerProps {
    sourceUrl: string;
    autoPlay?: boolean;
    muted?: boolean;
    style?: object;
    controls?: boolean;
    onEnd?: () => void;
}

export interface IVideoPlayerState {

}

export class VideoPlayer extends React.Component<IVideoPlayerProps & React.HTMLAttributes<HTMLVideoElement>, IVideoPlayerState> {

    videoNode: HTMLVideoElement;

    public static defaultProps: Partial<IVideoPlayerProps> = {
        autoPlay: true,
        muted: false,
        controls: false,
    }

    componentDidMount() {
        console.log('onEnd', this.props.onEnd);

        if (this.props.onEnd !== undefined) {
            this.videoNode.addEventListener('ended', this.props.onEnd, false);
        }
    }

    componentWillUnmount() {
        if (this.props.onEnd !== undefined) {
            this.videoNode.removeEventListener('ended', this.props.onEnd);
        }
    }

    render() {
        const {sourceUrl, autoPlay, muted, controls, ...restProps} = this.props;
        return (
            <div className="video-player-ctn">
                <video ref={(node: HTMLVideoElement) => {this.videoNode = node; }}
                       src={sourceUrl}
                       autoPlay={autoPlay}
                       muted={muted}
                       controls={controls}
                       {...restProps}
                />
            </div>
        );
    }

}
