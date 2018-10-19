import React from 'react';
import './control-bar.scss';
import { ControlBarDictionary } from './control-bar.i18n';

import { PlayButton, PauseButton, PrevButton, NextButton, SubtitlesButton } from './svg-mdi-button';

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
import VolumeControl from '@src/components/player/volume-control';
import { getFromDictionary } from '@src/i18n/basic-i18n';

export type ControlBarProps = {
    videoEl?: HTMLVideoElement | null;
    lang?: string;
    playbackRate?: number;
    enableSpeedControl?: boolean;
    enableBrowseControl?: boolean;
    enablePrevControl?: boolean;
    enableNextControl?: boolean;
    enableMuteControl?: boolean;

    mediaIsSilent?: boolean;

    disableButtonSpaceClick?: boolean;
    onNextLinkPressed?: () => void;
    onPreviousLinkPressed?: () => void;
    onRateChangeRequest?: (playbackRate: number) => void;
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
    enableMuteControl: true,
    mediaIsSilent: false,
    disableButtonSpaceClick: false,
    playbackRate: 1,
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
        const { videoEl, enableMuteControl, playbackRate, lang } = this.props;

        const LoadingIndicator = () => <LoadingButton />;

        const spaceAction = {
            disableSpaceClick: this.props.disableButtonSpaceClick,
        };

        const tr = this.tr;

        return (
            <div className={'control-bar-ctn'}>
                <div className="control-bar-ctn__progress-bar">
                    {videoEl && (
                        <ProgressBar videoEl={videoEl} progressInterval={500} isSeekable={true} onSeek={this.seekTo} />
                    )}
                </div>
                <PlaybackStatusProvider videoEl={videoEl ? videoEl : undefined}>
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
                                                <PauseButton
                                                    tooltip={tr('pause')}
                                                    isEnabled={true}
                                                    onClick={this.pause}
                                                    {...spaceAction}
                                                />
                                            ) : (
                                                <PlayButton
                                                    tooltip={tr('play')}
                                                    isEnabled={true}
                                                    onClick={this.play}
                                                    {...spaceAction}
                                                />
                                            )}
                                            {enableMuteControl && (
                                                <VolumeControl
                                                    tooltips={{
                                                        mute: tr('mute'),
                                                        unmute: tr('unmute'),
                                                    }}
                                                    muted={status.muted}
                                                    volume={status.volume}
                                                    onUnMute={this.unMute}
                                                    onMute={this.mute}
                                                    mediaIsSilent={props.mediaIsSilent}
                                                    disableSpaceClick={props.disableButtonSpaceClick}
                                                />
                                            )}
                                            {status.isLoading && <LoadingIndicator />}
                                        </>
                                    )}
                                </div>

                                <div className="control-bar-ctn__panel__right">
                                    {props.enableSpeedControl && (
                                        <PlaybackRateSelect
                                            playbackRate={playbackRate!}
                                            onChange={this.handleRateChangeRequest}
                                            {...spaceAction}
                                        />
                                    )}
                                    {status.trackLangs.length > 0 && (
                                        <SubtitlesButton
                                            isEnabled={true}
                                            tooltip={tr(
                                                !status.hasVisibleTextTrack ? 'show_subtitles' : 'hide_subtitles'
                                            )}
                                            extraClasses={status.hasVisibleTextTrack ? 'isActive' : ''}
                                            onClick={() => {
                                                this.toggleSubtitles();
                                                // This is a hack, we need to dispatch manually
                                                // the text track visibility change (no listeners exists ?)
                                                status.triggerTextTrackVisibilityChange();
                                            }}
                                            {...spaceAction}
                                        />
                                    )}
                                    {props.enablePrevControl && (
                                        <PrevButton
                                            tooltip={tr('play_previous')}
                                            isEnabled={this.props.onPreviousLinkPressed !== undefined}
                                            onClick={() => {
                                                this.props.onPreviousLinkPressed!();
                                            }}
                                            {...spaceAction}
                                        />
                                    )}
                                    {props.enableNextControl && (
                                        <NextButton
                                            tooltip={tr('play_next')}
                                            isEnabled={this.props.onNextLinkPressed !== undefined}
                                            onClick={() => {
                                                this.props.onNextLinkPressed!();
                                            }}
                                            {...spaceAction}
                                        />
                                    )}
                                    <div
                                        style={{
                                            border: '1px solid white',
                                            margin: '5px',
                                            padding: '2px',
                                        }}
                                    >
                                        Passer intro + jaune >>
                                    </div>
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
    };

    protected toggleMute = (): void => {};

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

    protected handleRateChangeRequest = (playbackRate: number): void => {
        /*
        const { videoEl } = this.props;
        if (videoEl) {
            videoEl.playbackRate = playbackRate;
        } else {
            this.logWarning('Cannot set playback rate,videoEl have not been registered');
        }*/
        if (this.props.onRateChangeRequest) {
            this.props.onRateChangeRequest(playbackRate);
        }
    };

    protected tr = (text: string): string => {
        return getFromDictionary(text, this.props.lang!, ControlBarDictionary);
    };

    protected logWarning(msg: string) {
        console.warn(`ControlBar: ${msg}`);
    }
}

export default ControlBar;
