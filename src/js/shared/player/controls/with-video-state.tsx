import React from 'react';
import { Subtract } from 'utility-types';

export type InjectedWithVideoProps = {
    duration: number;
    currentTime: number;
    bufferedTime: number;
};

type WithVideoProps = {
    videoEl: HTMLVideoElement;
    progressInterval?: number;
};

type VideoState = {
    currentTime: number;
    duration: number;
    bufferedTime: number;
};

const defaultState: VideoState = {
    currentTime: 0,
    duration: Infinity,
    bufferedTime: 0,
};

const withVideoState = <P extends InjectedWithVideoProps>(WrappedComponent: React.ComponentType<P>) => {
    class WithVideoState extends React.Component<Subtract<P, InjectedWithVideoProps> & WithVideoProps, VideoState> {
        protected interval!: number;

        constructor(props: P & WithVideoProps) {
            super(props);
            this.state = defaultState;
        }

        getSecondsLoaded = (): number => {
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

        setDuration = () => {
            const duration = this.props.videoEl.duration;
            if (!Number.isNaN(duration) && this.state.duration !== duration) {
                this.setState(
                    (prevState: VideoState): VideoState => {
                        return {
                            ...prevState,
                            duration: duration,
                        };
                    }
                );
            }
        };

        componentDidMount() {
            this.setDuration();
            this.props.videoEl.addEventListener('loadedmetadata', this.setDuration);
            this.interval = window.setInterval(() => {
                this.setState(
                    (prevState: VideoState): VideoState => {
                        return {
                            ...prevState,
                            currentTime: this.props.videoEl.currentTime,
                            bufferedTime: this.getSecondsLoaded(),
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
            const { videoEl, progressInterval, ...componentProps } = this.props as WithVideoProps;

            return (
                <WrappedComponent
                    {...componentProps}
                    currentTime={this.state.currentTime}
                    duration={this.state.duration}
                    bufferedTime={this.state.bufferedTime}
                />
            );
        }
    }

    return WithVideoState;
};

export default withVideoState;
