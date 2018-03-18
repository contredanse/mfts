import * as React from 'react';
import './video-player.scss';
import { HTMLAttributes } from 'react';

export interface IVideoPlayerProps {
    sourceUrl: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    style?: object;
    controls?: boolean;
    onEnd?: () => void;
    htmlAttributes?: HTMLAttributes<HTMLVideoElement>;
}

export interface IVideoPlayerState {}

export class VideoPlayer extends React.Component<IVideoPlayerProps, IVideoPlayerState> {
    public static defaultProps: Partial<IVideoPlayerProps> = {
        autoPlay: true,
        muted: false,
        loop: false,
        controls: false,
        htmlAttributes: {},
    };

    videoNode!: HTMLVideoElement;

    componentDidMount() {
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
        const { sourceUrl, autoPlay, muted, controls, htmlAttributes } = this.props;
        return (
            <div className="video-player-ctn">
                <video
                    ref={(node: HTMLVideoElement) => {
                        this.videoNode = node;
                    }}
                    src={sourceUrl}
                    autoPlay={autoPlay}
                    muted={muted}
                    controls={controls}
                    /*crossOrigin="anonymous"*/
                    webkit-playsinline="webkit-playsinline"
                    {...htmlAttributes}
                />
            </div>
        );
    }
}
