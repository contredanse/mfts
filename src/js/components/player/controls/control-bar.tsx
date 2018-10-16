import React from 'react';
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
    hasVisibleTextTrack,
    hideAllTextTracks,
    showLocalizedTextTrack,
} from '@src/components/player/controls/utils/video-texttrack-helpers';

import PlaybackStatusProvider from '@src/components/player/controls/hoc/playback-status-provider';
import LoadingButton from '@src/components/player/controls/svg-button/loading-button';
import TrackVisibilityHelper from '@src/components/player/track/track-visibility-helper';

export type ControlBarProps = {
    videoEl?: HTMLVideoElement;
    lang?: string;
    playbackRate: number;
    actions: PlayerActions;
    enableSpeedControl?: boolean;
    enableBrowseControl?: boolean;
    enablePrevControl?: boolean;
    enableNextControl?: boolean;
    onNextLinkPressed?: () => void;
    onPreviousLinkPressed?: () => void;
};

export type ControlbarState = {
    isActive: boolean;
};

const defaultProps = {
    lang: 'en',
    enableBrowseControl: false,
    enableSpeedControl: true,
    enableNextControl: true,
    enablePrevControl: true,
};

export class ControlBar extends React.PureComponent<ControlBarProps, ControlbarState> {
    static defaultProps = defaultProps;

    readonly state: ControlbarState;

    trackVisibilityHelper: TrackVisibilityHelper;

    /**
     * Whether the video listeners have been registered
     */
    protected listenersRegistered = false;

    constructor(props: ControlBarProps) {
        super(props);
        this.trackVisibilityHelper = new TrackVisibilityHelper();
        this.state = {
            isActive: true,
        };
    }

    render() {
        const props = this.props;
        const { videoEl, enableBrowseControl, enableSpeedControl, playbackRate } = this.props;

        const LoadingIndicator = () => <LoadingButton />;

        console.log('rerender controlbar', videoEl);

        return (
            <div className={'control-bar-ctn'}>
                <div className="control-bar-ctn__progress-bar">
                    {videoEl && (
                        <ProgressBar videoEl={videoEl} progressInterval={500} isSeekable={true} onSeek={this.seekTo} />
                    )}
                </div>
                <PlaybackStatusProvider videoEl={videoEl}>
                    {status => {
                        // No reliable way to be know what is the display state of subs
                        // Let's recalc everytime the playback state changes.
                        const hasVisibleTrack = videoEl && hasVisibleTextTrack(videoEl);
                        return (
                            <div className="control-bar-ctn__panel">
                                <div className="control-bar-ctn__panel__left">
                                    {videoEl && (
                                        <>
                                            {status.isPlaying ? (
                                                <PauseButton isEnabled={true} onClick={this.pause} />
                                            ) : (
                                                <PlayButton isEnabled={true} onClick={this.play} />
                                            )}
                                            {status.muted ? (
                                                <SoundOffButton isEnabled={true} onClick={this.unMute} />
                                            ) : (
                                                <SoundOnButton isEnabled={true} onClick={this.mute} />
                                            )}
                                            {status.isLoading && <LoadingIndicator />}
                                        </>
                                    )}
                                </div>

                                <div className="control-bar-ctn__panel__right">
                                    {props.enableSpeedControl && (
                                        <PlaybackRateSelect
                                            playbackRate={playbackRate}
                                            onChange={this.setPlaybackRate}
                                        />
                                    )}
                                    {status.trackLangs.length > 0 && (
                                        <SubtitlesButton
                                            isEnabled={true}
                                            extraClasses={status.hasVisibleTextTrack ? 'isActive' : ''}
                                            onClick={() => {
                                                this.toggleSubtitles();
                                                // This is a hack, we need to dispatch manually
                                                // the text track visibility change (no listeners exists ?)
                                                status.triggerTextTrackVisibilityChange();
                                            }}
                                        />
                                    )}
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
                        );
                    }}
                </PlaybackStatusProvider>
            </div>
        );
    }

    protected toggleSubtitles = (): void => {
        const { videoEl, lang } = this.props;
        if (videoEl) {
            if (hasVisibleTextTrack(videoEl)) {
                // A track was shown let's hide everything
                hideAllTextTracks(videoEl);
                this.trackVisibilityHelper.persistVisibilityModeInStorage('hidden');
            } else {
                // No tracks are show, let's display one
                this.trackVisibilityHelper.persistVisibilityModeInStorage('showing');
                showLocalizedTextTrack(videoEl, lang!);
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
        const { videoEl } = this.props;
        if (videoEl) {
            videoEl.currentTime = time;
        } else {
            this.logWarning('Cannot seek to time, videoEl have not been registered');
        }
    };

    protected setPlaybackRate = (playbackRate: number): void => {
        const { videoEl } = this.props;
        if (videoEl) {
            videoEl.playbackRate = playbackRate;
        } else {
            this.logWarning('Cannot set playback rate,videoEl have not been registered');
        }
    };

    protected logWarning(msg: string) {
        console.warn(`ControlBar: ${msg}`);
    }
}

export default ControlBar;
