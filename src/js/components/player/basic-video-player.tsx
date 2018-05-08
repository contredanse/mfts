import * as React from 'react';

export type ReactVideoHTMLProps = React.VideoHTMLAttributes<HTMLVideoElement>;

export type BasicVideoPlayerProps = {
    onEnd?: () => {};
} & ReactVideoHTMLProps;

export type BasicVideoPlayerState = {};

export class BasicVideoPlayer extends React.Component<BasicVideoPlayerProps, BasicVideoPlayerState> {
    static defaultProps: Partial<BasicVideoPlayerProps> = {
        autoPlay: true,
        loop: false,
    };

    videoNode!: HTMLVideoElement;

    constructor(props: BasicVideoPlayerProps) {
        super(props);
    }

    componentDidMount() {
        if (this.props.onEnd !== undefined) {
            this.videoNode.addEventListener('ended', this.props.onEnd, false);
        }
        if (this.props.autoPlay && (this.videoNode && this.videoNode.paused)) {
            this.play();
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

        //        const videoProps: Partial<keyof HTMLVideoElement> = this.props;

        const mediaEventsProps: Partial<ReactVideoHTMLProps> = {
            onCanPlay: this.props.onCanPlay,
            onEnded: () => {},
            onCanPlayThrough: () => {},
            onClick: () => {},
            onDoubleClick: () => {},
            onDurationChange: () => {},
        };

        return (
            <video
                ref={(node: HTMLVideoElement) => {
                    this.videoNode = node;
                }}
                muted={muted}
                loop={loop}
                controls={controls}
                autoPlay={autoPlay}
                webkit-playsinline="webkit-playsinline"
                {...mediaEventsProps}
            >
                {this.props.children}
            </video>
        );
    }
}
