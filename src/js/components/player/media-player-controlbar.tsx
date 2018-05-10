import * as React from 'react';
import { MediaPlayerActions } from '@src/components/player/media-player';

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
                <button type="button" style={props.isPlaying ? {} : activeStyle} onClick={props.actions.play}>
                    Play
                </button>
                <button type="button" style={props.isPlaying ? activeStyle : {}} onClick={props.actions.pause}>
                    Pause
                </button>
                <input
                    type="range"
                    min="0"
                    max={props.duration}
                    value={props.currentTime}
                    onChange={(e: React.SyntheticEvent<HTMLInputElement>) => {
                        e.persist();
                        props.actions.setCurrentTime(parseFloat(e.currentTarget.value));
                    }}
                />
                <select
                    onChange={e => {
                        props.actions.setPlaybackRate(4);
                    }}
                >
                    <option value="1">1</option>
                    <option value="2">1</option>
                </select>
                <p>duration: {props.duration}</p>
                <p>currentTime: {props.currentTime}</p>
                <p>playbackRate: {props.playbackRate}</p>
            </div>
        );
    }
}
