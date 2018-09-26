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
import ProgressBar from './progress-bar';
import PlaybackRateSelect from '@src/components/player/controls/playback-rate-select';
import {
    debugSubtitlesLoading,
    hasShownSubtitle,
    hideAllSubtitles,
    showSubtitle,
} from '@src/components/player/controls/utils/subtitles-actions';

import PlaybackStatusProvider from '@src/components/player/controls/hoc/playback-status-provider';
import LoadingButton from '@src/components/player/controls/svg-button/loading-button';

export type MediaPlayerControlBarProps = {
    videoEl?: HTMLVideoElement;
    duration: number;
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
    isActive: boolean;
    intervalWhilePlaying: number;
};

export class ControlBar extends React.PureComponent<MediaPlayerControlBarProps, MediaPlayerControlbarState> {
    static defaultProps = {
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
            intervalWhilePlaying: 0,
        };
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

        const LoadingIndicator = () => <LoadingButton />;

        return (
            <div className={'control-bar-ctn'}>
                <div className="control-bar-ctn__progress-bar">
                    {videoEl && (
                        <ProgressBar videoEl={videoEl} progressInterval={650} isSeekable={true} onSeek={this.seekTo} />
                    )}
                </div>
                <PlaybackStatusProvider videoEl={videoEl}>
                    {status => (
                        <div className="control-bar-ctn__panel">
                            <div className="control-bar-ctn__panel__left">
                                {status.isPlaying ? (
                                    <PauseButton isEnabled={true} onClick={this.pause} />
                                ) : (
                                    <PlayButton isEnabled={true} onClick={this.play} />
                                )}
                                {status.muted ? (
                                    <SoundOnButton isEnabled={true} onClick={this.unMute} />
                                ) : (
                                    <SoundOffButton isEnabled={true} onClick={this.mute} />
                                )}
                                {status.isLoading && <LoadingIndicator />}
                            </div>

                            <div className="control-bar-ctn__panel__right">
                                {props.enableSpeedControl && (
                                    <PlaybackRateSelect onChange={props.actions.setPlaybackRate} />
                                )}
                                <SubtitlesButton isEnabled={true} onClick={this.toggleSubtitles} />
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
                    )}
                </PlaybackStatusProvider>
            </div>
        );
    }

    protected toggleSubtitles = (): void => {
        const { videoEl } = this.props;
        if (videoEl) {
            if (hasShownSubtitle(videoEl)) {
                hideAllSubtitles(videoEl);
            } else {
                showSubtitle(videoEl, 'fr');
            }
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

export default ControlBar;
