import React, { Component, CSSProperties } from 'react';
import classNames from 'classnames';
import './progressbar.scss';

//import { compose, withChildrenStyles, withCustomizableClasses, withChildClasses } from '../utils/composers.js';
import RangeControlOverlay from './range-control-overlay';

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
    totalTime: number;
    currentTime: number;
    bufferedTime: number;
    isSeekable: boolean;
    onSeek: (time: number) => void;
    onSeekStart: (time: number) => void;
    onSeekEnd: (time: number) => void;
    onIntent: (time: number) => void;
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
class ProgressBar extends Component<ProgressBarProps, ProgressBarState> {
    static readonly defaultProps: Partial<ProgressBarProps> = {
        totalTime: Infinity,
        currentTime: 0,
        bufferedTime: 0,
        isSeekable: false,
        onSeek: () => {},
        onSeekStart: () => {},
        onSeekEnd: () => {},
        onIntent: () => {},
        style: {},
        className: 'ProgressBar',
        childClasses: {},
        childrenStyles: {
            RangeControlOverlay: {},
        },
    };

    protected progressbarRef: React.RefObject<HTMLDivElement>;

    constructor(props: ProgressBarProps) {
        super(props);

        this.state = {
            currentIntent: 0,
        };

        this.progressbarRef = React.createRef<HTMLDivElement>();
    }

    handleSeek = (relativeTime: number): void => {
        const { isSeekable, onSeek, totalTime } = this.props;

        if (isSeekable) {
            onSeek(relativeTime * totalTime);
        }
    };

    handleSeekStart = (relativeTime: number): void => {
        const { isSeekable, onSeekStart, totalTime } = this.props;

        if (isSeekable) {
            onSeekStart(relativeTime * totalTime);
        }
    };

    handleSeekEnd = (relativeTime: number): void => {
        const { isSeekable, onSeekEnd, totalTime } = this.props;

        if (isSeekable) {
            onSeekEnd(relativeTime * totalTime);
        }
    };

    handleIntent = (relativeTime: number): void => {
        const { isSeekable, onIntent, totalTime } = this.props;
        const intent = isSeekable ? relativeTime : 0;

        this.setState({
            ...this.state,
            currentIntent: intent,
        });

        if (isSeekable) {
            onIntent(relativeTime * totalTime);
        }
    };

    render() {
        const {
            totalTime,
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

        const progressPercent = Math.min(100, (100 * currentTime) / totalTime);
        const styleLeft = `${progressPercent}%`;

        const isRewindIntent = currentIntent !== 0 && currentIntent < currentTime / totalTime;

        return (
            <div
                className={classNames(className, extraClasses, {
                    isSeekable,
                    isRewindIntent,
                })}
                style={style}
                ref={this.progressbarRef}
            >
                <div
                    className={childClasses!.buffered || 'ProgressBar-buffered'}
                    style={{
                        width: `${Math.min(100, (100 * bufferedTime) / totalTime)}%`,
                        ...(childrenStyles!.buffered || {}),
                    }}
                />

                <div
                    className={childClasses!.elapsed || 'ProgressBar-elapsed'}
                    style={{ width: styleLeft, ...(childrenStyles!.elapsed || {}) }}
                />

                <div
                    className={childClasses!.intent || 'ProgressBar-intent'}
                    style={{ width: `${currentIntent * 100}%`, ...(childrenStyles!.intent || {}) }}
                />

                <div
                    className={childClasses!.handle || 'ProgressBar-handle'}
                    style={{ left: styleLeft, ...(childrenStyles!.handle || {}) }}
                />

                {isSeekable && (
                    <RangeControlOverlay
                        className={childClasses!.seek || 'ProgressBar-seek'}
                        style={childrenStyles!.RangeControlOverlay}
                        bounds={() => this.progressbarRef.current!.getBoundingClientRect()}
                        onValue={this.handleSeek}
                        onChangeStart={this.handleSeekStart}
                        onChangeEnd={this.handleSeekEnd}
                        onIntent={this.handleIntent}
                    />
                )}
            </div>
        );
    }
}

export default ProgressBar;

/*
export default compose(
    withChildrenStyles(),
    withCustomizableClasses('ProgressBar'),
    withChildClasses()
)(ProgressBar);
*/
