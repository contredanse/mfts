import * as React from 'react';
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

export type ReactVideoHTMLProps = React.VideoHTMLAttributes<HTMLVideoElement>;

export type BasicVideoPlayerProps = {
    onEnd?: () => {};
    webkitPlaysInline?: string;
} & ReactVideoHTMLProps;

export type BasicVideoPlayerState = {
    duration: number;
    currentTime: number;
};

type ProgressBarProps = {
    duration: number;
    currentTime: number;
    onPlay: () => void;
    onPause: () => void;
};

class ProgressBar extends React.Component<ProgressBarProps, any> {
    slider!: HTMLInputElement;

    constructor(props: ProgressBarProps) {
        super(props);
    }

    render() {
        const elem = (
            <>
                <button
                    onClick={() => {
                        this.props.onPlay();
                    }}
                >
                    Play
                </button>
                <button
                    onClick={() => {
                        this.props.onPause();
                    }}
                >
                    Pause
                </button>
                <input
                    ref={(slider: HTMLInputElement) => {
                        this.slider = slider;
                    }}
                    type="range"
                    name="points"
                    min="0"
                    value={this.props.currentTime}
                    max={this.props.duration}
                />
            </>
        );

        return elem;
    }
}

export class BasicVideoPlayer extends React.Component<BasicVideoPlayerProps, BasicVideoPlayerState> {
    static defaultProps: Partial<BasicVideoPlayerProps> = {
        autoPlay: true,
        loop: false,
        muted: false,
        webkitPlaysInline: 'webkit-playsinline',

        onCanPlay: () => {},
        onEnded: () => {},
        onCanPlayThrough: () => {},
        onClick: () => {},
        onDoubleClick: () => {},
        onDurationChange: () => {},
        onProgress: () => {},
        onTimeUpdate: () => {},
    };

    state: BasicVideoPlayerState;

    videoNode!: HTMLVideoElement;

    constructor(props: BasicVideoPlayerProps) {
        super(props);
        this.state = {
            duration: 0,
            currentTime: 0,
        };
    }

    componentDidMount() {
        if (this.videoNode !== undefined) {
            this.videoNode.addEventListener('loadedmetadata', () => {
                this.setState(prevState => {
                    return { ...prevState, duration: this.videoNode.duration };
                });
            });
            this.videoNode.addEventListener('timeupdate', () => {
                this.setState(prevState => {
                    return { ...prevState, currentTime: this.videoNode.currentTime };
                });
            });

            if (this.props.onEnd !== undefined) {
                this.videoNode.addEventListener('ended', this.props.onEnd, false);
            }
            if (this.props.autoPlay && (this.videoNode && this.videoNode.paused)) {
                this.play();
            }
        }
    }

    componentWillUnmount() {
        if (this.props.onEnd !== undefined) {
            this.videoNode.removeEventListener('ended', this.props.onEnd);
        }
    }

    play() {
        if (this.videoNode !== undefined) {
            // specific behaviour
            if (this.videoNode.ended && this.videoNode.loop) {
                // assume metadata are loaded (videoNode.ended should do the trick)
                this.videoNode.currentTime = 0;
            }

            // play() is a promise... and can be rejected.
            const playedPromise = this.videoNode.play();
            if (playedPromise) {
                playedPromise.catch(e => {
                    if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
                        console.log('Cannot autoplay video due to platform restrictions');
                    }
                });
            }
        }
    }

    render() {
        const { autoPlay, loop, ...restProps } = this.props;
        const muted = true;
        const controls = true;

        const mediaEventsProps: Partial<ReactVideoHTMLProps> = {
            onCanPlay: this.props.onCanPlay,
            onEnded: this.props.onEnded,
            onCanPlayThrough: this.props.onCanPlayThrough,
            onClick: this.props.onClick,
            onDoubleClick: this.props.onDoubleClick,
            onDurationChange: this.props.onDurationChange,
            onProgress: this.props.onProgress,
            onTimeUpdate: this.props.onTimeUpdate,
        };

        const webkitPlaysInlineProp = this.props.webkitPlaysInline
            ? {
                  'webkit-playsinline': 'webkit-playsinline',
              }
            : {};

        return <Player>{this.props.children}</Player>;

        /*
        return (
            <>

                <video
                    ref={(node: HTMLVideoElement) => {
                        this.videoNode = node;
                    }}
                    muted={muted}
                    loop={loop}
                    controls={controls}
                    autoPlay={autoPlay}
                    {...webkitPlaysInlineProp}
                    {...mediaEventsProps}
                >
                    {this.props.children}
                </video>
                <ProgressBar duration={this.state.duration}
                                currentTime={this.state.currentTime}
                                onPlay={() => {
                                    this.play()
                                }}
                                onPause={() => {this.videoNode.pause()}}/>


            </>
        );*/
    }
}

type WithVideoHOC = {
    style?: React.CSSProperties;
} & BasicVideoPlayerProps;

export const withVideoHOC = <P extends WithVideoHOC, A>(UnwrappedComponent: React.ComponentType<P>) =>
    class WithVideo extends React.Component<P, A> {
        render() {
            return (
                <UnwrappedComponent
                    {...this.props}
                    style={Object.assign({}, this.props.style, {
                        border: '5px solid blue',
                    })}
                />
            );
        }
    };
