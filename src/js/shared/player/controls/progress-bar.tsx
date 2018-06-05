import * as React from 'react';
import '../styles/progress-bar.scss';

export type ProgressBarProps = {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
};

export const ProgressBar: React.SFC<ProgressBarProps> = props => {
    const { currentTime, duration, onSeek } = props;

    // @optimize later, method creation should only be done when onSeek
    // prop changed

    const handleSeek = (e: React.SyntheticEvent<HTMLInputElement>) => {
        e.persist();
        onSeek(parseFloat(e.currentTarget.value));
    };

    return (
        <div className="control-progressbar-slider">
            <input
                className="control-progressbar-slider__range"
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
            />
        </div>
    );
};
