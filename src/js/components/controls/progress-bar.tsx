import * as React from 'react';
import './progress-bar.scss';

export type ProgressBarProps = {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
};

export const ProgressBar: React.SFC<ProgressBarProps> = props => {
    const { currentTime, duration, onSeek } = props;

    const handleSeek = (e: React.SyntheticEvent<HTMLInputElement>) => {
        e.persist();
        onSeek(parseFloat(e.currentTarget.value));
    };

    return (
        <div className="range-slider">
            <input
                className="range-slider__range"
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
            />
        </div>
    );
};
