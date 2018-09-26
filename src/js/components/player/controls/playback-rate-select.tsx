import React, { PureComponent, CSSProperties, ReactNode } from 'react';

export type PlaybackRates = Array<{
    value: number;
    title: string;
}>;

export type PlaybackRateSelectProps = {
    onChange?: (playbackRate: number) => void;
    isEnabled?: boolean;
    playbackRates?: PlaybackRates;
    style?: CSSProperties;
};

const defaultProps = {
    isEnabled: true,
    playbackRates: [
        { value: 2.0, title: '2.0' },
        { value: 1.5, title: '1.5' },
        { value: 1.0, title: '1.0' },
        { value: 0.5, title: '0.5' },
        { value: 0.2, title: '0.2' },
    ],
} as PlaybackRateSelectProps;

class PlaybackRateSelect extends PureComponent<PlaybackRateSelectProps> {
    static readonly defaultProps = defaultProps;

    render() {
        const { style, playbackRates } = this.props;

        return (
            <div className="control-bar__select" style={style}>
                <select onChange={this.handleChange}>
                    {playbackRates!.map(({ value, title }) => (
                        <option key={value} value={value}>
                            {title}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    protected handleChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        if (this.props.isEnabled && this.props.onChange !== undefined) {
            const playbackRate = parseFloat(e.currentTarget.value);
            this.props.onChange(playbackRate);
        }
    };
}

export default PlaybackRateSelect;
