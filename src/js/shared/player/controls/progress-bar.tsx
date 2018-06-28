import React, { Component, CSSProperties } from 'react';
import classNames from 'classnames';
import './progress-bar.scss';

import RangeControlOverlay from './range-control-overlay';
import withVideoProgress from '@src/shared/player/controls/with-video-progress';

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
    static readonly defaultProps: Partial<ProgressBarProps> = {
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

    handleSeek = (relativeTime: number): void => {
        const { isSeekable, onSeek, duration } = this.props;
        if (isSeekable) {
            onSeek(relativeTime * duration);
        }
    };

    handleSeekStart = (relativeTime: number): void => {
        const { isSeekable, onSeekStart, duration } = this.props;

        if (isSeekable) {
            onSeekStart!(relativeTime * duration);
        }
    };

    handleSeekEnd = (relativeTime: number): void => {
        const { isSeekable, onSeekEnd, duration } = this.props;

        if (isSeekable) {
            onSeekEnd!(relativeTime * duration);
        }
    };

    handleIntent = (relativeTime: number): void => {
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
                <div>
                    {this.formatMilliseconds(currentTime)} / {this.formatMilliseconds(duration)}
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

    protected formatMilliseconds(milli: number): string {
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

export default withVideoProgress(ProgressBar);
