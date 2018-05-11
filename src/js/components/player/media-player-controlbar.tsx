import * as React from 'react';
import { MediaPlayerActions } from '@src/components/player/media-player';
import './media-player-controlbar.scss';

export type MediaPlayerControlBarProps = {
    duration: number;
    currentTime: number;
    isPlaying: boolean;
    playbackRate: number;
    actions: MediaPlayerActions;
};

export default class MediaPlayerControlBar extends React.Component<MediaPlayerControlBarProps, {}> {
    constructor(props: MediaPlayerControlBarProps) {
        super(props);
    }

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
                            <button
                                type="button"
                                style={props.isPlaying ? activeStyle : {}}
                                onClick={props.actions.play}
                            >
                                Play
                            </button>
                            <button
                                type="button"
                                style={props.isPlaying ? {} : activeStyle}
                                onClick={props.actions.pause}
                            >
                                Pause
                            </button>
                        </div>
                        <div className="range-slider">
                            <input
                                className="range-slider__range"
                                type="range"
                                min="0"
                                max={props.duration}
                                value={props.currentTime}
                                onChange={(e: React.SyntheticEvent<HTMLInputElement>) => {
                                    e.persist();
                                    props.actions.setCurrentTime(parseFloat(e.currentTarget.value));
                                }}
                            />
                        </div>
                        <div>
                            {this.formatMilliseconds(props.currentTime)}/{this.formatMilliseconds(props.duration)}
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
}
