import React, { CSSProperties } from 'react';

import VideoProxy from '@src/models/proxy/video-proxy';
import VideoSourceProxy from '@src/models/proxy/video-source-proxy';
import { showLocalizedTextTrack } from '@src/components/player/controls/utils/video-texttrack-helpers';
import VideoPlayer, { TextTrackProps, VideoSourceProps } from '@src/components/player/video-player';
import AudioProxy from '@src/models/proxy/audio-proxy';

export type VideoProxyPlayerProps = {
    videoProxy: VideoProxy | AudioProxy;
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

export type VideoProxyPlayerState = {};

const defaultProps = {
    playsInline: true,
    playing: false,
};

const defaultState = {};

export default class VideoProxyPlayer extends React.Component<VideoProxyPlayerProps, VideoProxyPlayerState> {
    static defaultProps = defaultProps;

    readonly state: VideoProxyPlayerState = defaultState;

    protected playerRef: React.RefObject<VideoPlayer>;

    constructor(props: VideoProxyPlayerProps) {
        super(props);
        this.playerRef = React.createRef<VideoPlayer>();
    }

    shouldComponentUpdate(nextProps: VideoProxyPlayerProps, nextState: VideoProxyPlayerState): boolean {
        // A new video have been given

        const mediaId =
            this.props.videoProxy instanceof AudioProxy
                ? this.props.videoProxy.getSourceFile()
                : this.props.videoProxy.videoId;

        const nextMediaId =
            nextProps.videoProxy instanceof AudioProxy
                ? nextProps.videoProxy.getSourceFile()
                : nextProps.videoProxy.videoId;

        if (mediaId !== nextMediaId) {
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
        const { crossOrigin, disablePoster, className, muted, loop, videoProxy, activeSubtitleLang } = this.props;

        let firstCover = null;
        let videoSources = null;
        if (videoProxy instanceof VideoProxy) {
            firstCover = videoProxy.getFirstCover();
            videoSources = mapVideoSourceProxyToVideoSourceProps(videoProxy.getSources());
        } else {
            videoSources = mapAudioProxyToVideoSourceProps(videoProxy);
        }
        const textTracks = mapMediaProxyTracksToTextTracksProps(videoProxy, activeSubtitleLang);

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

export const mapAudioProxyToVideoSourceProps = (audioProxy: AudioProxy): VideoSourceProps[] => {
    const src = audioProxy.getSourceFile();
    if (src) {
        return [
            {
                src: src,
                type: 'video/mp4',
            },
        ];
    }
    return [];
};

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

export const mapMediaProxyTracksToTextTracksProps = (
    mediaProxy: VideoProxy | AudioProxy,
    langToSetAsDefault?: string
): TextTrackProps[] => {
    const playerTracks: TextTrackProps[] = [];
    mediaProxy.getAllTracks().forEach(mediaTrack => {
        playerTracks.push({
            kind: 'subtitles',
            src: mediaTrack.src,
            srcLang: mediaTrack.lang,
            label: mediaTrack.lang,
            ...(langToSetAsDefault === mediaTrack.lang ? { default: true } : {}),
        });
    });
    return playerTracks;
};
