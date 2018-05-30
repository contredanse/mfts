import * as React from 'react';
import { MediaPlayerActions } from '@src/components/player/media-player';
import './media-player-controlbar.scss';
import { ProgressBar } from '@src/components/controls/progress-bar';

export type MediaPlayerControlBarProps = {
    videoEl?: HTMLVideoElement;
    duration: number;
    currentTime: number;
    isPlaying: boolean;
    playbackRate: number;
    actions: MediaPlayerActions;
};

export type MediaPlayerControlbarState = {
    currentTime: number;
};

export default class MediaPlayerControlBar extends React.Component<
    MediaPlayerControlBarProps,
    MediaPlayerControlbarState
> {
    readonly state: MediaPlayerControlbarState;

    /**
     * Whether the video listeners have been registered
     */
    protected listenersRegistered: boolean = false;

    constructor(props: MediaPlayerControlBarProps) {
        super(props);
        this.state = {
            currentTime: 0,
        };
    }

    componentDidMount() {
        // If videoEl is initially available, let's register listeners at mount
        if (this.props.videoEl) {
            this.registerVideoListeners(this.props.videoEl);
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
    }

    protected play = () => {
        const videoRef = this.props.videoEl;
        if (videoRef) {
            console.log('CALLING PLAY !!!!!!!');
            videoRef.play();
        }
        this.props.actions.play();
    };

    protected pause = () => {
        const videoRef = this.props.videoEl;
        console.log('VIDEOREF', this.props);
        if (videoRef) {
            console.log('CALLING PAUSE !!!!!!!');
            videoRef.pause();
        }
        this.props.actions.pause();
    };

    render() {
        const props = this.props;
        const activeStyle = {
            border: '3px solid black',
        };

        return (
            <div>
                <div>
                    <div className="control-bar">
                        <div>
                            <button type="button" style={props.isPlaying ? activeStyle : {}} onClick={this.play}>
                                Play
                            </button>
                            <button type="button" style={props.isPlaying ? {} : activeStyle} onClick={this.pause}>
                                Pause
                            </button>
                        </div>
                        <ProgressBar
                            currentTime={this.state.currentTime}
                            duration={props.duration}
                            onSeek={(time: number) => {
                                props.actions.setCurrentTime(time);
                            }}
                        />
                        {/*
                        <div className="range-slider">
                            <input
                                className="range-slider__range"
                                type="range"
                                min="0"
                                max={props.duration}
                                value={this.state.currentTime}
                                onChange={(e: React.SyntheticEvent<HTMLInputElement>) => {
                                    e.persist();
                                    props.actions.setCurrentTime(parseFloat(e.currentTarget.value));
                                }}
                            />
                        </div>
                        */}
                        <div>
                            {this.formatMilliseconds(this.state.currentTime)}/{this.formatMilliseconds(props.duration)}
                        </div>
                        <div>
                            <select
                                onChange={(e: React.SyntheticEvent<HTMLSelectElement>) => {
                                    console.log('onchange', e.currentTarget.value);
                                    props.actions.setPlaybackRate(parseFloat(e.currentTarget.value));
                                }}
                            >
                                <option value="1">1</option>
                                <option value="0.5">0.5</option>
                                <option value="0.25">0.25</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    protected registerVideoListeners(video: HTMLVideoElement, skipOnRegistered: boolean = true): void {
        if (skipOnRegistered && this.listenersRegistered) return;
        console.log('REGISTERING VIDEOLISTENER');
        video.addEventListener('timeupdate', this.handeTimeUpdate);
        this.listenersRegistered = true;
    }

    protected unregisterVideoListeners(video: HTMLVideoElement): void {
        video.removeEventListener('timeupdate', this.handeTimeUpdate);
        this.listenersRegistered = false;
    }

    protected handeTimeUpdate = (e: Event) => {
        const { currentTime } = e.currentTarget as HTMLVideoElement;
        this.setState((prevState, prevProps) => {
            return { ...prevState, currentTime: currentTime };
        });
    };

    formatMilliseconds(milli: number): string {
        const d = Math.trunc(milli);
        const h = Math.floor(d / 3600);
        const m = Math.floor((d % 3600) / 60);
        const s = Math.floor((d % 3600) % 60);
        const minutes = m.toString().padStart(h > 0 ? 2 : 1, '0');
        const seconds = s.toString().padStart(2, '0');
        const hDisplay = h > 0 ? `${h}:` : '';
        const mDisplay = m > 0 ? `${minutes}:` : `${'0'.padStart(m > 0 ? 2 : 1, '0')}:`;
        const sDisplay = s > 0 ? `${seconds}` : '00';
        return `${hDisplay}${mDisplay}${sDisplay}`;
    }
}
