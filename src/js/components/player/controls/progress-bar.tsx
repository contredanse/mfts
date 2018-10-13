import React, { Component, CSSProperties } from 'react';
import classNames from 'classnames';
import './progress-bar.scss';

import RangeControlOverlay from './range-control-overlay';
import withVideoProgress from './hoc/with-video-progress';
import { formatSecondsToHuman } from '@src/components/player/utils/formatters';

export type ProgressBarChildClasses = {
    elapsed?: string;
    buffered?: string;
    intent?: string;
    handle?: string;
    seek?: string;
};

export type ProgressBarChildrenStyles = {
    elapsed?: CSSProperties;
    buffered?: CSSProperties;
    intent?: CSSProperties;
    handle?: CSSProperties;
    RangeControlOverlay?: CSSProperties;
};

export type ProgressBarProps = {
    duration: number;
    currentTime: number;
    bufferedTime: number;
    isSeekable: boolean;
    onSeek: (time: number) => void;
    onSeekStart?: (time: number) => void;
    onSeekEnd?: (time: number) => void;
    onIntent?: (time: number) => void;
    className?: string;
    extraClasses?: string;
    childClasses?: ProgressBarChildClasses;
    style?: CSSProperties;
    childrenStyles?: ProgressBarChildrenStyles;
};

type ProgressBarState = {
    currentIntent: number;
};

/**
 * Seekable progress bar
 */
export class ProgressBar extends Component<ProgressBarProps, ProgressBarState> {
    static defaultProps = {
        duration: Infinity,
        currentTime: 0,
        bufferedTime: 0,
        isSeekable: false,
        onSeek: () => {},
        onSeekStart: () => {},
        onSeekEnd: () => {},
        onIntent: () => {},
        style: {},
        className: 'controls__progress-bar',
        childClasses: {},
        childrenStyles: {
            RangeControlOverlay: {},
        },
    };

    readonly state: ProgressBarState;

    protected progressbarRef: React.RefObject<HTMLDivElement>;

    constructor(props: ProgressBarProps) {
        super(props);

        this.state = {
            currentIntent: 0,
        };

        this.progressbarRef = React.createRef<HTMLDivElement>();
    }

    shouldComponentUpdate(nextProps: ProgressBarProps, nextState: ProgressBarState): boolean {
        return (
            nextProps.currentTime !== this.props.currentTime ||
            nextProps.duration !== this.props.duration ||
            nextProps.bufferedTime !== this.props.bufferedTime
        );
    }

    render() {
        const {
            duration,
            currentTime,
            bufferedTime,
            isSeekable,
            className,
            extraClasses,
            childClasses,
            style,
            childrenStyles,
        } = this.props;

        const { currentIntent } = this.state;

        const progressPercent = Math.min(100, (100 * currentTime) / duration);
        const styleLeft = `${progressPercent}%`;

        const isRewindIntent = currentIntent !== 0 && currentIntent < currentTime / duration;

        return (
            <>
                <div className="controls__progress-bar-time">
                    {formatSecondsToHuman(currentTime)} / {formatSecondsToHuman(duration)}
                </div>

                <div
                    className={classNames(className, extraClasses, {
                        isSeekable,
                        isRewindIntent,
                    })}
                    style={style}
                    ref={this.progressbarRef}
                >
                    <div
                        className={childClasses!.buffered || 'controls__progress-bar-buffered'}
                        style={{
                            width: `${Math.min(100, (100 * bufferedTime) / duration)}%`,
                            ...(childrenStyles!.buffered || {}),
                        }}
                    />

                    <div
                        className={childClasses!.elapsed || 'controls__progress-bar-elapsed'}
                        style={{ width: styleLeft, ...(childrenStyles!.elapsed || {}) }}
                    />

                    <div
                        className={childClasses!.intent || 'controls__progress-bar-intent'}
                        style={{ width: `${currentIntent * 100}%`, ...(childrenStyles!.intent || {}) }}
                    />

                    <div
                        className={childClasses!.handle || 'controls__progress-bar-handle'}
                        style={{ left: styleLeft, ...(childrenStyles!.handle || {}) }}
                    />

                    {isSeekable && (
                        <RangeControlOverlay
                            className={childClasses!.seek || 'controls__progress-bar-seek'}
                            style={childrenStyles!.RangeControlOverlay}
                            bounds={() => this.progressbarRef.current!.getBoundingClientRect()}
                            onValue={this.handleSeek}
                            onChangeStart={this.handleSeekStart}
                            onChangeEnd={this.handleSeekEnd}
                            onIntent={this.handleIntent}
                        />
                    )}
                </div>
            </>
        );
    }

    private handleSeek = (relativeTime: number): void => {
        const { isSeekable, onSeek, duration } = this.props;
        if (isSeekable) {
            onSeek(relativeTime * duration);
        }
    };

    private handleSeekStart = (relativeTime: number): void => {
        const { isSeekable, onSeekStart, duration } = this.props;

        if (isSeekable) {
            onSeekStart!(relativeTime * duration);
        }
    };

    private handleSeekEnd = (relativeTime: number): void => {
        const { isSeekable, onSeekEnd, duration } = this.props;

        if (isSeekable) {
            onSeekEnd!(relativeTime * duration);
        }
    };

    private handleIntent = (relativeTime: number): void => {
        const { isSeekable, onIntent, duration } = this.props;
        const intent = isSeekable ? relativeTime : 0;

        this.setState({
            ...this.state,
            currentIntent: intent,
        });

        if (isSeekable) {
            onIntent!(relativeTime * duration);
        }
    };
}

export default withVideoProgress(ProgressBar);
