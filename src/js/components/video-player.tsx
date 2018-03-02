import * as React from 'react';
import "./video-player.scss";
import {HTMLAttributes} from "react";


export interface IVideoPlayerProps {
    sourceUrl: string;
    autoPlay?: boolean;
    muted?: boolean;
    style?: object;
    controls?: boolean;
    onEnd?: () => void;
    htmlAttributes?: HTMLAttributes<HTMLVideoElement>
}

export interface IVideoPlayerState {

}

export class VideoPlayer extends React.Component<IVideoPlayerProps, IVideoPlayerState> {

    videoNode: HTMLVideoElement;

    public static defaultProps: Partial<IVideoPlayerProps> = {
        autoPlay: true,
        muted: false,
        controls: false,
        htmlAttributes: {},
    }

    componentDidMount() {
        if (this.props.onEnd !== undefined) {
            console.log('onEndIsLoaded', this.props.onEnd)
            this.videoNode.addEventListener('ended', this.props.onEnd, false);
        } else {
            console.log('onEndIsUndinfed')
        }
    }

    componentWillUnmount() {
        if (this.props.onEnd !== undefined) {
            console.log('onEndIsUnloaded', this.props.onEnd)
            this.videoNode.removeEventListener('ended', this.props.onEnd);
        }
    }

    render() {
        const {sourceUrl, autoPlay, muted, controls, htmlAttributes} = this.props;

        return (
            <div className="video-player-ctn">
                <video ref={(node: HTMLVideoElement) => {this.videoNode = node; }}
                       src={sourceUrl}
                       autoPlay={autoPlay}
                       muted={muted}
                       controls={controls}
                       {...htmlAttributes}
                />
            </div>
        );
    }

}
