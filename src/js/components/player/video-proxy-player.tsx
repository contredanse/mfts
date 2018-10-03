import React, { CSSProperties, forwardRef } from 'react';
import ReactPlayer, {
    Config as ReactPlayerConfig,
    FileConfig as ReactPlayerFileConfig,
    ReactPlayerProps,
} from 'react-player';

import VideoProxy from '@src/models/proxy/video-proxy';
import VideoSourceProxy from '@src/models/proxy/video-source-proxy';
import { showLocalizedTextTrack } from '@src/components/player/controls/utils/video-texttrack-helpers';
import VideoPlayer, { TextTrackProps, VideoSourceProps } from '@src/components/player/video-player';

export type VideoProxyPlayerProps = {
    videoProxy: VideoProxy;
    disablePoster?: boolean;
    disableSubtitles?: boolean;
    activeSubtitleLang?: string;
    crossOrigin?: 'anonymous';
    fallbackLang?: string;
    playing?: boolean;
    playbackRate?: number;
    style?: CSSProperties;
    playsInline?: boolean;
    className?: string;
    loop?: boolean;
    muted?: boolean;
};

export type VideoProxyPlayerState = {
    initialized: boolean;
    videoProxy: VideoProxy;
    activeSubtitleLang?: string;
    firstCover?: string;
    videoSources: VideoSourceProps[];
    textTracks: TextTrackProps[];
};

const defaultProps = {
    playsInline: true,
    playing: false,
};

export default class VideoProxyPlayer extends React.Component<VideoProxyPlayerProps, VideoProxyPlayerState> {
    static defaultProps = defaultProps;

    readonly state: VideoProxyPlayerState;

    protected playerRef: React.RefObject<VideoPlayer>;

    constructor(props: VideoProxyPlayerProps) {
        super(props);
        //this.playerRef = React.createRef<ReactPlayer>();
        this.playerRef = React.createRef<VideoPlayer>();
        this.state = {
            initialized: false,
        } as VideoProxyPlayerState;
    }

    static getDerivedStateFromProps(
        nextProps: VideoProxyPlayerProps,
        prevState: VideoProxyPlayerState
    ): VideoProxyPlayerState | null {
        const { initialized } = prevState;
        if (
            !initialized ||
            prevState.activeSubtitleLang !== nextProps.activeSubtitleLang ||
            prevState.videoProxy.videoId !== nextProps.videoProxy.videoId
        ) {
            const { videoProxy, activeSubtitleLang, disableSubtitles, crossOrigin, disablePoster } = nextProps;
            return {
                initialized: true,
                videoProxy: nextProps.videoProxy,
                firstCover: videoProxy.getFirstCover(),
                activeSubtitleLang: nextProps.activeSubtitleLang,
                videoSources: mapVideoSourceProxyToVideoSourceProps(videoProxy.getSources()),
                textTracks: mapVideoProxyTracksToTextTracksProps(videoProxy, activeSubtitleLang),
            };
        } else {
            // console.log('NOT CALLING GETDERIVEDSTATEFROMPROPS');
        }

        // Return null to indicate no change to state.
        return null;
    }

    shouldComponentUpdate(nextProps: VideoProxyPlayerProps, nextState: VideoProxyPlayerState): boolean {
        // A new video have been given
        if (nextProps.videoProxy.videoId !== this.props.videoProxy.videoId) {
            return true;
        }

        if (nextProps.playbackRate !== this.props.playbackRate) {
            return true;
        }

        // To be tested, a better solution must be found
        if (nextProps.activeSubtitleLang !== this.props.activeSubtitleLang) {
            const videoEl = this.playerRef.current!.getVideoElement() as HTMLVideoElement;
            showLocalizedTextTrack(videoEl, nextProps.activeSubtitleLang || nextProps.fallbackLang!);
            return false;
        }
        return false;
    }

    getHTMLVideoElement(): HTMLVideoElement | null {
        if (!this.playerRef.current) {
            return null;
        }
        return this.playerRef.current.getVideoElement() as HTMLVideoElement;
    }

    render() {
        const { crossOrigin, disablePoster, className, muted, loop } = this.props;
        const { videoSources, textTracks, firstCover, videoProxy } = this.state;
        return (
            <VideoPlayer
                ref={this.playerRef}
                style={this.props.style}
                playing={true}
                controls={false}
                playsInline={true}
                crossOrigin={crossOrigin}
                srcs={videoSources}
                {...(textTracks ? { tracks: textTracks } : {})}
                {...(!disablePoster && firstCover ? { cover: firstCover } : {})}
                {...(className ? { className } : {})}
                {...(muted ? { muted } : {})}
                {...(loop ? { loop } : {})}
            />
        );
    }
}

export const mapVideoSourceProxyToVideoSourceProps = (videoSources: VideoSourceProxy[]): VideoSourceProps[] => {
    return videoSources.reduce(
        (acc, source) => {
            return [
                ...acc,
                {
                    src: source.getSource(),
                    type: source.getHtmlVideoTypeValue(),
                },
            ];
        },
        [] as VideoSourceProps[]
    );
};

export const mapVideoProxyTracksToTextTracksProps = (
    video: VideoProxy,
    langToSetAsDefault?: string
): TextTrackProps[] => {
    const playerTracks: TextTrackProps[] = [];
    video.getAllTracks().forEach(videoTrack => {
        playerTracks.push({
            kind: 'subtitles',
            src: videoTrack.src,
            srcLang: videoTrack.lang,
            label: videoTrack.lang,
            ...(langToSetAsDefault === videoTrack.lang ? { default: true } : {}),
        });
    });
    return playerTracks;
};
