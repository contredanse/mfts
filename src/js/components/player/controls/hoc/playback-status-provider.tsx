import React from 'react';
import { getAvailableTrackLanguages } from '@src/components/player/controls/utils/video-texttrack-helpers';

type InjectedPlaybackStatusProps = {
    value: number;

    isPlaying: boolean;
    muted: boolean;
    volume: number;
    isLoading: boolean;
    trackLangs: string[];

    onTest(): void;
};

type PlaybackStatusProps = {
    videoEl?: HTMLVideoElement;
    children(props: InjectedPlaybackStatusProps): JSX.Element;
};

type PlaybackStatusState = {
    value: number;
    isPlaying: boolean;
    muted: boolean;
    volume: number;
    isLoading: boolean;
    trackLangs: string[];
    test: number;
};

const defaultPlaybackStatusState = {
    value: 0,
    isPlaying: false,
    muted: false,
    volume: 1.0,
    isLoading: true,
    trackLangs: [],
    test: 0,
};

export default class PlaybackStatusProvider extends React.Component<PlaybackStatusProps, PlaybackStatusState> {
    readonly state: PlaybackStatusState = defaultPlaybackStatusState;

    protected listenersRegistered = false;

    constructor(props: PlaybackStatusProps) {
        super(props);
    }

    test = () => {
        this.setState(prevState => ({
            test: prevState.test + 1,
        }));
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
        if (
            (!prevProps.videoEl && this.props.videoEl) ||
            (this.props.videoEl !== undefined && prevProps.videoEl !== this.props.videoEl)
        ) {
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
            trackLangs: this.state.trackLangs,
            onTest: this.test,
        });
    }

    protected registerVideoListeners(video: HTMLVideoElement, skipOnRegistered: boolean = true): void {
        if (skipOnRegistered && this.listenersRegistered) {
            return;
        }
        video.addEventListener('volumechange', this.updateVolumeState);
        video.addEventListener('addtrack', this.updateTrackState);
        video.addEventListener('play', this.updateVideoState);
        video.addEventListener('load', this.updateVideoState);
        video.addEventListener('pause', this.updateVideoState);
        video.addEventListener('canplay', this.updateVideoState);
        video.addEventListener('waiting', this.setLoadingState);
        this.listenersRegistered = true;
    }

    protected unregisterVideoListeners(video: HTMLVideoElement): void {
        if (this.listenersRegistered) {
            video.removeEventListener('volumechange', this.updateVolumeState);
            video.removeEventListener('addtrack', this.updateTrackState);
            video.removeEventListener('play', this.updateVideoState);
            video.removeEventListener('load', this.updateVideoState);
            video.removeEventListener('pause', this.updateVideoState);
            video.removeEventListener('canplay', this.updateVideoState);
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
     * Update track/subtitles availability
     * @param {Event<HTMLVideoElement>} e
     */
    protected updateTrackState = (e: Event): void => {
        const { videoEl } = this.props;

        if (videoEl && e.target !== null) {
            this.setState({
                trackLangs: getAvailableTrackLanguages(videoEl),
            });
        } else {
            console.warn('Cannot update trackState, no "event.target" available', e);
        }
    };

    /**
     * Update local state with loading state
     * @param {Event<HTMLVideoElement>} e
     */
    protected setLoadingState = (e: Event): void => {
        const { videoEl } = this.props;
        if (videoEl && e.target !== null) {
            const isPlaying = !videoEl.paused && !videoEl.ended && videoEl.readyState > 2;
            this.setState({
                isPlaying: isPlaying,
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
    protected updateVideoState = (e: Event): void => {
        const { videoEl } = this.props;

        if (videoEl && e.target !== null) {
            const isPlaying = !videoEl.paused && !videoEl.ended && videoEl.readyState > 2;
            this.setState({
                isPlaying: isPlaying,
                isLoading: false,
                trackLangs: getAvailableTrackLanguages(videoEl),
                volume: videoEl.volume,
                muted: videoEl.muted,
            });
        } else {
            console.warn('Cannot update playingState, no "event.target" available', e);
        }
    };
}
