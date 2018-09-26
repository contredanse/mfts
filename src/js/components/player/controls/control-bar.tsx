import React, { MouseEvent } from 'react';
import './control-bar.scss';
import {
    PlayButton,
    PauseButton,
    PrevButton,
    NextButton,
    SubtitlesButton,
    SoundOffButton,
    SoundOnButton,
} from './svg-mdi-button';
import { PlayerActions } from '@src/shared/player/player';
import { default as ProgressBar } from './progress-bar';

export type MediaPlayerControlBarProps = {
    videoEl?: HTMLVideoElement;
    duration: number;
    currentTime: number;
    playbackRate: number;
    actions: PlayerActions;
    enableSpeedControl?: boolean;
    enableBrowseControl?: boolean;
    enablePrevControl?: boolean;
    enableNextControl?: boolean;
    onNextLinkPressed?: () => void;
    onPreviousLinkPressed?: () => void;
};

export type MediaPlayerControlbarState = {
    currentTime: number;
    bufferTime: number;
    isActive: boolean;
    isPlaying: boolean;
    intervalWhilePlaying: number;
    muted: boolean;
    volume: number;
    isLoading: boolean;
};

export class ControlBar extends React.Component<MediaPlayerControlBarProps, MediaPlayerControlbarState> {
    static readonly defaultProps: Partial<MediaPlayerControlBarProps> = {
        enableBrowseControl: false,
        enableSpeedControl: true,
        enableNextControl: true,
        enablePrevControl: true,
    };

    readonly state: MediaPlayerControlbarState;

    /**
     * Whether the video listeners have been registered
     */
    protected listenersRegistered = false;

    constructor(props: MediaPlayerControlBarProps) {
        super(props);
        this.state = {
            isActive: true,
            isPlaying: false,
            currentTime: 0,
            bufferTime: 0,
            intervalWhilePlaying: 0,
            muted: false,
            volume: 1.0,
            isLoading: true,
        };
    }

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
                currentTime: videoEl.currentTime || 0,
                isLoading: videoEl.readyState <= 2,
            }));
            //this.progressBar = withVideoProgress(NewProgressBar);
        }
    }

    componentDidUpdate(prevProps: MediaPlayerControlBarProps, prevState: MediaPlayerControlbarState): void {
        // In case of videoEl was not available at initial render
        // listeners will be initialized at update
        if (!prevProps.videoEl && this.props.videoEl) {
            this.registerVideoListeners(this.props.videoEl);
        }
    }

    componentWillUnmount() {
        // Removing the video listeners if they were registered
        if (this.props.videoEl && this.listenersRegistered) {
            this.unregisterVideoListeners(this.props.videoEl);
            this.listenersRegistered = false;
        }

        // to handle autoHide: clearInterval(this.interval);
    }

    handleEnableHover = (e: MouseEvent<HTMLDivElement>): void => {
        this.setState({
            isActive: true,
        });
    };

    handleDisableHover = (e: MouseEvent<HTMLDivElement>): void => {
        this.setState({
            isActive: false,
        });
    };

    render() {
        const props = this.props;
        const { videoEl, duration, enableBrowseControl, enableSpeedControl } = this.props;
        const activeStyle = {
            border: '3px solid yellow',
        };

        const { muted, isLoading, isPlaying } = this.state;

        const overlayWrapper = () => {
            return (
                <div
                    className={'control-bar-overlay' + (!isPlaying ? ' control-bar-overlay--active' : '')}
                    onMouseOver={this.handleEnableHover}
                    onMouseOut={this.handleDisableHover}
                >
                    <div className="control-bar-overlay-top" />
                    <div className="control-bar-overlay-middle" />
                    <div className="control-bar-overlay-bottom">Hello the controbar</div>
                </div>
            );
        };

        const LoadingIndicator = () => <div>Loading...</div>;

        return (
            <div className={'control-bar-ctn'}>
                <div className="control-bar-ctn__progress-bar">
                    {videoEl && (
                        <ProgressBar videoEl={videoEl} progressInterval={650} isSeekable={true} onSeek={this.seekTo} />
                    )}
                </div>
                <div className="control-bar-ctn__panel">
                    <div className="control-bar-ctn__panel__left">
                        {!isPlaying && <PlayButton isEnabled={true} onClick={this.play} />}
                        {isPlaying && <PauseButton isEnabled={true} onClick={this.pause} />}
                        {muted ? (
                            <SoundOnButton isEnabled={true} onClick={this.unMute} />
                        ) : (
                            <SoundOffButton isEnabled={true} onClick={this.mute} />
                        )}
                        {isLoading && <LoadingIndicator />}
                    </div>

                    <div className="control-bar-ctn__panel__right">
                        {props.enableSpeedControl && (
                            <div className="control-bar__select">
                                <select
                                    onChange={(e: React.SyntheticEvent<HTMLSelectElement>) => {
                                        const speed = parseFloat(e.currentTarget.value);
                                        props.actions.setPlaybackRate(speed);
                                    }}
                                >
                                    <option value="2">2</option>
                                    <option value="1">1</option>
                                    <option value="0.5">0.5</option>
                                    <option value="0.25">0.25</option>
                                    <option value="0.10">0.10</option>
                                </select>
                            </div>
                        )}

                        <SubtitlesButton
                            isEnabled={true}
                            onClick={() => {
                                alert('cool');
                            }}
                        />

                        {props.enablePrevControl && (
                            <PrevButton
                                isEnabled={this.props.onPreviousLinkPressed !== undefined}
                                onClick={() => {
                                    this.props.onPreviousLinkPressed!();
                                }}
                            />
                        )}

                        {props.enableNextControl && (
                            <NextButton
                                isEnabled={this.props.onNextLinkPressed !== undefined}
                                onClick={() => {
                                    this.props.onNextLinkPressed!();
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
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
        video.removeEventListener('volumechange', this.updateVolumeState);
        video.removeEventListener('playing', this.updatePlayingState);
        video.removeEventListener('pause', this.updatePlayingState);
        video.removeEventListener('waiting', this.setLoadingState);
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

    protected play = (): void => {
        const { videoEl } = this.props;
        if (videoEl) {
            const playPromise = videoEl.play();

            // In browsers that don’t yet support this functionality,
            // playPromise won’t be defined.
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Automatic playback started!
                    })
                    .catch(error => {
                        // Automatic playback failed.
                        this.logWarning(`Cannot play video, promise rejected: ${error}`);
                    });
            }
        } else {
            this.logWarning('Cannot play video, videoEl have not been registered');
        }

        this.props.actions.play();
    };

    protected mute = (): void => {
        const { videoEl } = this.props;
        if (videoEl) {
            videoEl.muted = true;
        } else {
            this.logWarning('Cannot mute video, videoEl have not been registered');
        }
    };

    protected unMute = (): void => {
        const { videoEl } = this.props;
        if (videoEl) {
            videoEl.muted = false;
        } else {
            this.logWarning('Cannot un-mute video, videoEl have not been registered');
        }
    };

    protected pause = (): void => {
        const { videoEl } = this.props;
        if (videoEl) {
            videoEl.pause();
        } else {
            this.logWarning('Cannot pause video, videoEl have not been registered');
        }
        this.props.actions.pause();
    };

    protected seekTo = (time: number): void => {
        console.log('SEEKTO', time);
        const { videoEl } = this.props;
        if (videoEl) {
            videoEl.currentTime = time;
        } else {
            this.logWarning('Cannot seek to time, videoEl have not been registered');
        }
    };

    protected logWarning(msg: string) {
        console.warn(`Controlbar: ${msg}`);
    }
}

//export default withVideoProgress(ControlBar);
export default ControlBar;
