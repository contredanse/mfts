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
                            {props.currentTime}/{props.duration}
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
