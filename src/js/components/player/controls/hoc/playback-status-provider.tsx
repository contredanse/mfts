import React from 'react';

interface InjectedCounterProps {
    value: number;

    isPlaying: boolean;
    muted: boolean;
    volume: number;
    isLoading: boolean;

    onIncrement(): void;
}

interface PlaybackStatusProps {
    videoEl?: HTMLVideoElement;
    children(props: InjectedCounterProps): JSX.Element;
}

interface PlaybackStatusState {
    value: number;
    isPlaying: boolean;
    muted: boolean;
    volume: number;
    isLoading: boolean;
}

const defaultPlaybackStatusState = {
    value: 0,
    isPlaying: false,
    muted: false,
    volume: 1.0,
    isLoading: true,
};

export default class PlaybackStatusProvider extends React.Component<PlaybackStatusProps, PlaybackStatusState> {
    readonly state: PlaybackStatusState = defaultPlaybackStatusState;

    protected listenersRegistered = false;

    constructor(props: PlaybackStatusProps) {
        super(props);
        console.log('RECREATE');
    }

    increment = () => {};

    decrement = () => {
        /*
        this.setState(prevState => ({
            value:
                prevState.value === this.props.minValue
                    ? prevState.value
                    : prevState.value - 1,
        }));*/
    };

    componentDidMount() {
        // If videoEl is initially available, let's register listeners at mount
        if (this.props.videoEl) {
            const { videoEl } = this.props;
            this.registerVideoListeners(videoEl);
            this.setState(prevState => ({
                ...prevState,
                playing: !videoEl.paused,
                muted: videoEl.muted,
                volume: videoEl.volume,
                isLoading: videoEl.readyState <= 2,
            }));
        }
    }

    componentDidUpdate(prevProps: PlaybackStatusProps): void {
        // In case of videoEl was not available at initial render
        // listeners will be initialized at update
        if (!prevProps.videoEl && this.props.videoEl) {
            this.registerVideoListeners(this.props.videoEl);
        }
    }

    componentWillUnmount() {
        if (this.props.videoEl) {
            this.unregisterVideoListeners(this.props.videoEl);
        }
    }

    render() {
        if (!this.props.videoEl) {
            return null;
        }
        return this.props.children({
            value: this.state.value,
            isPlaying: this.state.isPlaying,
            isLoading: this.state.isLoading,
            muted: this.state.muted,
            volume: this.state.volume,
            onIncrement: this.increment,
        });
    }

    protected registerVideoListeners(video: HTMLVideoElement, skipOnRegistered: boolean = true): void {
        if (skipOnRegistered && this.listenersRegistered) {
            return;
        }
        video.addEventListener('volumechange', this.updateVolumeState);
        video.addEventListener('playing', this.updatePlayingState);
        video.addEventListener('pause', this.updatePlayingState);
        video.addEventListener('waiting', this.setLoadingState);
        this.listenersRegistered = true;
    }

    protected unregisterVideoListeners(video: HTMLVideoElement): void {
        if (this.listenersRegistered) {
            video.removeEventListener('volumechange', this.updateVolumeState);
            video.removeEventListener('playing', this.updatePlayingState);
            video.removeEventListener('pause', this.updatePlayingState);
            video.removeEventListener('waiting', this.setLoadingState);
        }
        this.listenersRegistered = false;
    }

    /**
     * Update local state with volume and mute
     * @param {Event<HTMLVideoElement>} e
     */
    protected updateVolumeState = (e: Event): void => {
        const { videoEl } = this.props;

        if (videoEl && e.target !== null) {
            if (this.state.muted !== videoEl.muted || this.state.volume !== videoEl.volume) {
                this.setState({
                    volume: videoEl.volume,
                    muted: videoEl.muted,
                });
            }
        } else {
            console.warn('Cannot update volumeState, no "event.target" available', e);
        }
    };

    /**
     * Update local state with loading state
     * @param {Event<HTMLVideoElement>} e
     */
    protected setLoadingState = (e: Event): void => {
        const { videoEl } = this.props;
        if (videoEl && e.target !== null) {
            this.setState({
                isLoading: true,
            });
        } else {
            console.warn('Cannot update loadingState, no "event.target" available', e);
        }
    };

    /**
     * Update local state with loading state
     * @param {Event<HTMLVideoElement>} e
     */
    protected updatePlayingState = (e: Event): void => {
        console.log('UPDATEPLAYINGSTATE');
        const { videoEl } = this.props;
        if (videoEl && e.target !== null) {
            this.setState({
                isPlaying: !videoEl.paused,
                isLoading: false,
            });
        } else {
            console.warn('Cannot update playingState, no "event.target" available', e);
        }
    };
}
