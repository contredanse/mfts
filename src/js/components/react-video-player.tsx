//import React from 'react';
import React, {HTMLAttributes} from 'react';
import { Player } from 'video-react';
import "video-react/styles/scss/video-react.scss"
import './video-player.scss';

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

export interface IVideoPlayerState {

}

export class ReactVideoPlayer extends React.Component<IVideoPlayerProps, IVideoPlayerState> {

    videoNode: HTMLVideoElement;

    public static defaultProps: Partial<IVideoPlayerProps> = {
        autoPlay: true,
        muted: false,
        loop: false,
        controls: false,
        htmlAttributes: {},
    };

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    render() {
        //const {sourceUrl, autoPlay, muted, controls, htmlAttributes} = this.props;
        const {sourceUrl} = this.props;
        return (
            <div className="video-player-ctn">

                <Player>
                    <source src={sourceUrl} />
                </Player>

            </div>
        );
    }

}


