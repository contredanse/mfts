import React, { MouseEvent } from 'react';
import './control-bar.scss';
import PlayButton from '@src/shared/player/controls/play-button';
import PauseButton from '@src/shared/player/controls/pause-button';
import PrevButton from '@src/shared/player/controls/prev-button';
import NextButton from '@src/shared/player/controls/next-button';
import { PlayerActions } from '@src/shared/player/player';
import { default as ProgressBar } from '@src/shared/player/controls/progress-bar';
import SoundOffButton from '@src/shared/player/controls/sound-off-button';
import SoundOnButton from '@src/shared/player/controls/sound-on-button';

export type MediaPlayerControlBarProps = {
    videoEl?: HTMLVideoElement;
    duration: number;
    currentTime: number;
    isPlaying: boolean;
    playbackRate: number;
    actions: PlayerActions;
    enableSpeedControl?: boolean;
    enableBrowseControl?: boolean;
    onNextLinkPressed?: () => void;
    onPreviousLinkPressed?: () => void;
};

export type MediaPlayerControlbarState = {
    currentTime: number;
    bufferTime: number;
    isActive: boolean;
    intervalWhilePlaying: number;
};

export class ControlBar extends React.Component<MediaPlayerControlBarProps, MediaPlayerControlbarState> {
    static readonly defaultProps: Partial<MediaPlayerControlBarProps> = {
        enableBrowseControl: false,
        enableSpeedControl: true,
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
            currentTime: 0,
            bufferTime: 0,
            intervalWhilePlaying: 0,
        };
    }

    componentDidMount() {
        // If videoEl is initially available, let's register listeners at mount
        if (this.props.videoEl) {
            this.registerVideoListeners(this.props.videoEl);
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

        const { isActive } = this.state;
        const { isPlaying } = this.props;

        return (
            <div
                className={'control-bar-overlay' + (!isPlaying ? ' control-bar-overlay--active' : '')}
                onMouseOver={this.handleEnableHover}
                onMouseOut={this.handleDisableHover}
            >
                <div className="control-bar-overlay-top" />
                <div className="control-bar-overlay-middle" />
                <div className="control-bar-overlay-bottom">
                    <div className={'control-bar-ctn'}>
                        <div className="control-bar-ctn__progress-bar">
                            {videoEl && (
                                <ProgressBar
                                    videoEl={videoEl}
                                    progressInterval={650}
                                    isSeekable={true}
                                    onSeek={this.seekTo}
                                />
                            )}
                        </div>

                        <div className="control-bar-ctn__panel">
                            <div className="control-bar-ctn__panel__left">
                                {!props.isPlaying && <PlayButton isEnabled={true} onClick={this.play} />}
                                {props.isPlaying && <PauseButton isEnabled={true} onClick={this.pause} />}
                                <PrevButton isEnabled={false} />
                                <SoundOnButton isEnabled={true} onClick={this.unMute} />
                                <SoundOffButton isEnabled={true} onClick={this.mute} />
                            </div>

                            <div className="control-bar-ctn__panel__right">
                                {props.enableSpeedControl && (
                                    <div className="control-bar__select">
                                        <select
                                            onChange={(e: React.SyntheticEvent<HTMLSelectElement>) => {
                                                //console.log('onchange', e.currentTarget.value);
                                                props.actions.setPlaybackRate(parseFloat(e.currentTarget.value));
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

                                <NextButton
                                    isEnabled={this.props.onNextLinkPressed !== undefined}
                                    onClick={() => {
                                        this.props.onNextLinkPressed!();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    protected registerVideoListeners(video: HTMLVideoElement, skipOnRegistered: boolean = true): void {
        if (skipOnRegistered && this.listenersRegistered) {
            return;
        }
        //video.addEventListener('timeupdate', this.updateCurrentTimeState);
        this.listenersRegistered = true;
    }

    protected unregisterVideoListeners(video: HTMLVideoElement): void {
        //video.removeEventListener('timeupdate', this.updateCurrentTimeState);
        this.listenersRegistered = false;
    }

    /**
     * Update local state with current time from
     * @param {Event<HTMLVideoElement>} e
     */
    protected updateCurrentTimeState = (e: Event): void => {
        if (e.target !== null && 'currentTime' in e.target) {
            const { currentTime } = e.target as HTMLVideoElement;
            this.setState((prevState, prevProps) => {
                return { ...prevState, currentTime: currentTime };
            });
        } else {
            console.warn('Cannot update currentTime state, no "event.target.currentTime" available', e);
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
