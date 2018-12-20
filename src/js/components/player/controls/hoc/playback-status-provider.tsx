import React from 'react';
import {
    getAvailableTrackLanguages,
    hasVisibleTextTrack,
} from '@src/components/player/controls/utils/video-texttrack-helpers';

type InjectedPlaybackStatusProps = {
    isPlaying: boolean;
    muted: boolean;
    volume: number;
    isLoading: boolean;
    loadingError: boolean;
    loadingErrorMsg?: string;
    trackLangs: string[];
    hasVisibleTextTrack: boolean;
    readyState: number;

    duration: number;
    currentTime: number;
    bufferedTime: number;

    isEnded: boolean;

    // An hack because we don't have a reliable way / dedicated
    // listener for track display/hide.
    // The child component must handle track visibility and trigger
    // the change to get an updated playback status.
    triggerTextTrackVisibilityChange: (visible?: boolean) => void;
};

type PlaybackStatusProps = {
    videoEl?: HTMLVideoElement;
    progressInterval: number;
    children(props: InjectedPlaybackStatusProps): JSX.Element;
};

const defaultProps = {
    progressInterval: 300,
};

// We'll actually inject our own state
export type PlaybackStatusState = {} & InjectedPlaybackStatusProps;

const defaultPlaybackStatusState = {
    isPlaying: false,
    muted: false,
    volume: 1.0,
    isLoading: true,
    loadingError: false,
    trackLangs: [],
    hasVisibleTextTrack: false,
    readyState: 0,
    currentTime: 0,
    bufferedTime: 0,
    isEnded: false,
    duration: Infinity,
};

export default class PlaybackStatusProvider extends React.PureComponent<PlaybackStatusProps, PlaybackStatusState> {
    static defaultProps = defaultProps;

    readonly state: PlaybackStatusState;

    protected listenersRegistered = false;

    protected progressInterval!: number;

    protected isCancelled = false;

    constructor(props: PlaybackStatusProps) {
        super(props);
        this.state = {
            ...defaultPlaybackStatusState,
            triggerTextTrackVisibilityChange: this.triggerTextTrackVisibilityChange,
        };
    }

    componentDidMount() {
        // If videoEl is initially available, let's register listeners at mount
        if (this.props.videoEl) {
            const { videoEl } = this.props;
            this.setState(prevState => ({
                ...prevState,
                playing: !videoEl.paused,
                muted: videoEl.muted,
                volume: videoEl.volume,
                isLoading: videoEl.readyState <= 2 && videoEl.error === null,
                loadingError: videoEl.error !== null,
                loadingErrorMsg:
                    'Error loading video: ' +
                    (videoEl.error !== null
                        ? `Error loading video: ${videoEl.error.message}, code ${videoEl.error.code}`
                        : 'undefined error'),
            }));
            this.registerVideoListeners(videoEl);
            this.progressInterval = window.setInterval(() => {
                if (!this.isCancelled) {
                    this.setState(
                        (prevState: PlaybackStatusState): PlaybackStatusState => {
                            //const { videoEl } = this.props;
                            return {
                                ...prevState,
                                currentTime: videoEl.currentTime,
                                bufferedTime: this.getSecondsLoaded(),
                                duration: videoEl.duration,
                            };
                        }
                    );
                }
            }, this.props.progressInterval);
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
        this.isCancelled = true;
        clearInterval(this.progressInterval);
        if (this.props.videoEl) {
            this.unregisterVideoListeners(this.props.videoEl);
        }
    }

    render() {
        if (!this.props.videoEl) {
            return this.props.children({
                ...this.state,
                isLoading: false,
                isPlaying: false,
            });
        }
        return this.props.children(this.state);
    }

    private registerVideoListeners(video: HTMLVideoElement, skipOnRegistered: boolean = true): void {
        if (skipOnRegistered && this.listenersRegistered) {
            return;
        }
        video.addEventListener('volumechange', this.updateVolumeState);
        video.addEventListener('addtrack', this.updateTrackState);
        video.addEventListener('canplay', this.updateVideoState);
        video.addEventListener('play', this.updateVideoState);
        video.addEventListener('load', this.updateVideoState);
        video.addEventListener('pause', this.updateVideoState);
        video.addEventListener('ended', this.setEndedState);
        video.addEventListener('waiting', this.setLoadingState);
        video.addEventListener('loaderror', this.setLoadErrorState);

        this.listenersRegistered = true;
    }

    private unregisterVideoListeners(video: HTMLVideoElement): void {
        if (this.listenersRegistered) {
            video.removeEventListener('volumechange', this.updateVolumeState);
            video.removeEventListener('addtrack', this.updateTrackState);
            video.removeEventListener('canplay', this.updateVideoState);
            video.removeEventListener('play', this.updateVideoState);
            video.removeEventListener('pause', this.updateVideoState);
            video.removeEventListener('load', this.updateVideoState);
            video.removeEventListener('ended', this.setEndedState);
            video.removeEventListener('waiting', this.setLoadingState);
            video.removeEventListener('loaderror', this.setLoadErrorState);
        }
        this.listenersRegistered = false;
    }

    /**
     * Update local state with volume and mute
     * @param {Event<HTMLVideoElement>} e
     */
    private updateVolumeState = (e: Event): void => {
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
    private updateTrackState = (e: Event): void => {
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
     * @param {Event<HTMLVideoElement>} e
     */
    private setEndedState = (e: Event): void => {
        const { videoEl } = this.props;
        if (videoEl && e.target !== null) {
            //if (!this.state.isPlaying) {
            this.setState(prevState => ({
                ...prevState,
                isEnded: true,
                isPlaying: false,
            }));
            //}
        } else {
            console.warn('Cannot update setEndedState, no "event.target" available', e);
        }
    };

    /**
     * Update local state with loading state
     * @param {Event<HTMLVideoElement>} e
     */
    private setLoadingState = (e: Event): void => {
        const { videoEl } = this.props;
        if (videoEl && e.target !== null) {
            const isPlaying = !videoEl.paused && !videoEl.ended && videoEl.readyState > 2;
            this.setState({
                isPlaying: isPlaying,
                isLoading: true,
                isEnded: false,
                loadingError: false,
            });
        } else {
            console.warn('Cannot update loadingState, no "event.target" available', e);
        }
    };

    /**
     * @param {Event<HTMLVideoElement>} e
     */
    private setLoadErrorState = (e: Event): void => {
        const { videoEl } = this.props;
        if (videoEl) {
            const error = videoEl.error;
            this.setState({
                isLoading: false,
                isEnded: false,
                loadingError: true,
                loadingErrorMsg:
                    'Error loading video: ' +
                    (error !== null ? `Error loading video: ${error.message}, code ${error.code}` : 'undefined error'),
            });
        }
    };

    /**
     * Update local state with loading state
     * @param {Event<HTMLVideoElement>} e
     */
    private updateVideoState = (e: Event): void => {
        const { videoEl } = this.props;
        if (videoEl && e.target !== null) {
            const isPlaying = !videoEl.paused && !videoEl.ended && videoEl.readyState > 2;
            this.setState({
                readyState: videoEl.readyState,
                isPlaying: isPlaying,
                isEnded: false,
                isLoading: false,
                trackLangs: getAvailableTrackLanguages(videoEl),
                hasVisibleTextTrack: hasVisibleTextTrack(videoEl),
                volume: videoEl.volume,
                muted: videoEl.muted,
                loadingError: false,
                loadingErrorMsg: undefined,
            });
        } else {
            console.warn('Cannot update playingState, no "event.target" available', e);
        }
    };

    /**
     *
     * @param visible if undefined, will auto detect current visibility
     */
    private triggerTextTrackVisibilityChange = (visible?: boolean): void => {
        if (visible === undefined) {
            const { videoEl } = this.props;
            visible = videoEl ? hasVisibleTextTrack(videoEl) : false;
        }
        this.setState({
            hasVisibleTextTrack: visible,
        });
    };

    private getSecondsLoaded = (): number => {
        if (!this.props.videoEl) {
            return 0;
        }
        const { buffered } = this.props.videoEl;
        if (buffered.length === 0) {
            return 0;
        }
        const end = buffered.end(buffered.length - 1);
        const duration = this.props.videoEl.duration;
        if (end > duration) {
            return duration;
        }
        return end;
    };
}
