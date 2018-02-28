import * as React from 'react';

export interface IVideoPlayerProps {
    sourceUrl: string;
    autoPlay?: boolean;
    muted?: boolean;
    style?: object;
    controls?: boolean
    onEnd?: () => void
}

export interface IVideoPlayerState {

}

export class VideoPlayer extends React.Component<IVideoPlayerProps, IVideoPlayerState> {

    videoNode: HTMLVideoElement;

    public static defaultProps: Partial<IVideoPlayerProps> = {
        autoPlay: true,
        muted: false,
        controls: false,
        style: {}
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.onEnd !== undefined) {
            this.videoNode.addEventListener('ended', this.props.onEnd, false)
        }
    }

    componentWillUnmount() {
        if (this.props.onEnd !== undefined) {
            this.videoNode.removeEventListener('ended', this.props.onEnd);
        }
    }

    render(): JSX.Element {
        const {sourceUrl, autoPlay, muted, style, controls} = this.props;
        return (
            <video ref={(node: HTMLVideoElement) => {this.videoNode = node} }
                   src={sourceUrl}
                   autoPlay={autoPlay}
                   muted={muted}
                   style={style}
                   controls={controls}
            />
        )
    }

}

