//import React from 'react';
import React, { HTMLAttributes } from 'react';

import {
    Player,
    ControlBar,
    ReplayControl,
    ForwardControl,
    CurrentTimeDisplay,
    TimeDivider,
    PlaybackRateMenuButton,
    VolumeMenuButton,
} from 'video-react';
/*import { Player
} from 'video-react';*/
import './react-video-player.scss';

export interface IVideoPlayerProps {
    sourceUrl?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    poster?: string;
    style?: object;
    controls?: boolean;
    onEnd?: () => void;
    htmlAttributes?: HTMLAttributes<HTMLVideoElement>;
}

export interface IVideoPlayerState {}

export class ReactVideoPlayer extends React.Component<IVideoPlayerProps, IVideoPlayerState> {
    videoNode: HTMLVideoElement;

    public static defaultProps: Partial<IVideoPlayerProps> = {
        autoPlay: true,
        muted: false,
        loop: false,
        controls: false,
        htmlAttributes: {},
    };

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        //const {sourceUrl, autoPlay, muted, controls, htmlAttributes} = this.props;
        const { sourceUrl, autoPlay, poster, ...otherAttributes } = this.props;

        return (
            <div className="video-player-ctn">
                <Player
                    preload="auto"
                    playsInline={true}
                    poster={poster}
                    fluid={false}
                    src={sourceUrl}
                    autoPlay={autoPlay}
                    {...otherAttributes}
                >
                    {this.props.children}

                    <ControlBar>
                        <ReplayControl seconds={10} order={1.1} />
                        <ForwardControl seconds={30} order={1.2} />
                        <CurrentTimeDisplay order={4.1} />
                        <TimeDivider order={4.2} />
                        <PlaybackRateMenuButton rates={[1, 0.5, 0.2]} order={7.1} />
                        <VolumeMenuButton disabled />
                    </ControlBar>
                </Player>
            </div>
        );
    }
}
