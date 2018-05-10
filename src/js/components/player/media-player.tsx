import * as React from 'react';

type HTMLVideoProps = React.VideoHTMLAttributes<HTMLVideoElement>;

export type MediaPlayerEffects = {
    updateCurrentTime: (time: number) => void;
    updateMetadata: (metadata: HTMLMediaMetadata) => void;
    updatePlaybackRate: (rate: number) => void;
    updatePlayingState: (isPlaying: boolean) => void;
};

export type MediaPlayerActions = {
    pause: () => void;
    play: () => void;
    setPlaybackRate: (playbackRate: number) => void;
    setCurrentTime: (currentTime: number) => void;
};

export type HTMLMediaMetadata = {
    duration: number;
    videoWidth: number;
    videoHeight: number;
};

export type MediaPlayerProps = {
    effects?: MediaPlayerEffects;
    // hack for iOS webkit (is specified prefix is removed)
    disableWebkitPlaysInline?: true;
} & HTMLVideoProps;

export type MediaPlayerState = {
    isPlaying: boolean;
};

export default class MediaPlayer extends React.Component<MediaPlayerProps, MediaPlayerState> {
    static defaultProps: Partial<MediaPlayerProps> = {
        // loop: false,
    };

    readonly state: MediaPlayerState;
    protected videoRef!: React.RefObject<HTMLVideoElement>;

    constructor(props: MediaPlayerProps) {
        super(props);
        const initialState = {
            isPlaying: false,
        };
        this.state = initialState;
        this.videoRef = React.createRef<HTMLVideoElement>();
    }

    componentDidMount() {
        const videoEl: HTMLVideoElement | null = this.videoRef.current;
        if (videoEl) {
            if (this.props.effects) {
                if (this.props.effects.updateCurrentTime) {
                    videoEl.addEventListener('timeupdate', (e: Event) => {
                        const { currentTime } = e.currentTarget as HTMLVideoElement;
                        this.props.effects!.updateCurrentTime!(currentTime);
                    });
                }

                if (this.props.effects.updatePlaybackRate) {
                    videoEl.addEventListener('ratechange', (e: Event) => {
                        const { playbackRate } = e.currentTarget as HTMLVideoElement;
                        this.props.effects!.updatePlaybackRate!(playbackRate);
                    });
                }

                if (this.props.effects.updateMetadata) {
                    videoEl.addEventListener('loadedmetadata', (e: Event) => {
                        const videoEl = e.currentTarget as HTMLVideoElement;
                        this.props.effects!.updateMetadata!({
                            duration: videoEl.duration,
                            videoWidth: videoEl.videoWidth,
                            videoHeight: videoEl.videoHeight,
                        });
                    });
                }
            }
        }
    }

    componentWillUnmount() {
        // Modern browsers does not require to remove listeners.
        // In case of memory leaks, we can do it here.
    }

    componentDidUpdate(prevProps: MediaPlayerProps, prevState: MediaPlayerState): void {
        if (prevState.isPlaying !== this.state.isPlaying) {
            if (this.state.isPlaying) {
                this.videoRef.current!.play();
            } else {
                this.videoRef.current!.pause();
            }
        }
    }

    getVideoElement(): HTMLVideoElement {
        return this.videoRef.current as HTMLVideoElement;
    }

    render() {
        const { disableWebkitPlaysInline, effects, ...htmlVideoProps } = this.props;
        const webkitPlaysInlineProp = disableWebkitPlaysInline ? {} : { 'webkit-playsinline': 'webkit-playsinline' };

        return (
            <video
                ref={this.videoRef}
                onPlay={() => this.updateIsPlaying()}
                onPause={() => this.updateIsPlaying()}
                {...htmlVideoProps}
                {...webkitPlaysInlineProp}
            >
                {this.props.children}
            </video>
        );
    }

    protected dispatchUpdateIsPlaying(isPlaying: boolean): void {
        if (this.props.effects && this.props.effects.updatePlayingState) {
            this.props.effects.updatePlayingState(isPlaying);
        }
    }

    protected updateIsPlaying(): void {
        this.setState((prevState, props) => {
            const { paused } = this.videoRef.current as HTMLVideoElement;
            const isPlaying = !paused;
            this.dispatchUpdateIsPlaying(isPlaying);
            return { isPlaying: isPlaying };
        });
    }
}
