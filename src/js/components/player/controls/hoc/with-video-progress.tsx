/**
 * Utility HOC for getting video currentTime, bufferedTime and duration
 */
import React from 'react';
import { Subtract } from 'utility-types';

export type InjectedWithVideoProgressProps = {
    duration: number;
    currentTime: number;
    bufferedTime: number;
};

type WithVideoProgressProps = {
    videoEl: HTMLVideoElement;
    progressInterval?: number;
};

type VideoProgressState = {
    currentTime: number;
    bufferedTime: number;
    duration: number;
};

const defaultState: VideoProgressState = {
    currentTime: 0,
    bufferedTime: 0,
    duration: Infinity,
};

const withVideoProgress = <P extends InjectedWithVideoProgressProps>(WrappedComponent: React.ComponentType<P>) => {
    type VideoProgressInnerProps = Subtract<P, InjectedWithVideoProgressProps> & WithVideoProgressProps;

    class WithVideoProgress extends React.Component<VideoProgressInnerProps, VideoProgressState> {
        readonly state: VideoProgressState;

        protected interval!: number;

        constructor(props: P & WithVideoProgressProps) {
            super(props);
            this.state = defaultState;
        }

        componentDidMount() {
            this.setDuration();
            this.props.videoEl.addEventListener('loadedmetadata', this.setDuration);
            this.interval = window.setInterval(() => {
                this.setState(
                    (prevState: VideoProgressState): VideoProgressState => {
                        const { videoEl } = this.props;
                        return {
                            ...prevState,
                            currentTime: videoEl.currentTime,
                            bufferedTime: this.getSecondsLoaded(),
                            duration: videoEl.duration,
                        };
                    }
                );
            }, this.props.progressInterval);
        }

        componentWillUnmount() {
            this.props.videoEl.removeEventListener('loadedmetadata', this.setDuration);
            clearInterval(this.interval);
        }

        render() {
            // destructure inner props
            const { videoEl, progressInterval, ...componentProps } = this.props as WithVideoProgressProps;
            const { currentTime, duration, bufferedTime } = this.state;

            return (
                <WrappedComponent
                    {...componentProps}
                    currentTime={currentTime}
                    duration={duration}
                    bufferedTime={bufferedTime}
                />
            );
        }

        protected getSecondsLoaded = (): number => {
            const { buffered } = this.props.videoEl;
            if (buffered.length === 0) {
                return 0;
            }
            const end = buffered.end(buffered.length - 1);
            const duration = this.props.videoEl.duration;
            if (end > duration) {
                return duration;
            }
            return end;
        };

        protected setDuration = () => {
            const duration = this.props.videoEl.duration;
            if (!Number.isNaN(duration) && this.state.duration !== duration) {
                this.setState(
                    (prevState: VideoProgressState): VideoProgressState => {
                        return {
                            ...prevState,
                            duration: duration,
                        };
                    }
                );
            }
        };
    }

    return WithVideoProgress;
};

export default withVideoProgress;
