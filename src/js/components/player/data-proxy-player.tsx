import React, { CSSProperties, SyntheticEvent } from 'react';

import VideoProxy from '@src/models/proxy/video-proxy';
import VideoSourceProxy from '@src/models/proxy/video-source-proxy';
import {
    hideAllTextTracks,
    showLocalizedTextTrack,
} from '@src/components/player/controls/utils/video-texttrack-helpers';
import VideoPlayer, { TextTrackProps, VideoSourceProps } from '@src/components/player/video-player';
import AudioProxy from '@src/models/proxy/audio-proxy';
import { TrackVisibilityMode } from '@src/components/player/track/track-visibility-helper';

export type DataProxyPlayerProps = {
    videoProxy: VideoProxy | AudioProxy;
    defaultSubtitleLang?: string;
    subtitleVisibility?: TrackVisibilityMode;
    crossOrigin?: 'anonymous';
    fallbackLang?: string;
    disablePoster?: boolean;
    disableSubtitles?: boolean;
    playing?: boolean;
    playbackRate?: number;
    style?: CSSProperties;
    playsInline?: boolean;
    className?: string;
    loop?: boolean;
    muted?: boolean;
    onEnded?: (e: SyntheticEvent<HTMLVideoElement>) => void;
};

export type DataProxyPlayerState = {};

const defaultProps = {
    playsInline: true,
    playing: false,
    disableSubtitles: false,
    disablePoster: false,
    subtitleVisibility: 'showing',
};

const defaultState = {};

export default class DataProxyPlayer extends React.Component<DataProxyPlayerProps, DataProxyPlayerState> {
    static defaultProps = defaultProps;

    readonly state: DataProxyPlayerState = defaultState;

    protected playerRef: React.RefObject<VideoPlayer>;

    constructor(props: DataProxyPlayerProps) {
        super(props);
        this.playerRef = React.createRef<VideoPlayer>();
    }

    shouldComponentUpdate(nextProps: DataProxyPlayerProps, nextState: DataProxyPlayerState): boolean {
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
        if (
            nextProps.defaultSubtitleLang !== this.props.defaultSubtitleLang ||
            nextProps.subtitleVisibility !== this.props.subtitleVisibility
        ) {
            const videoEl = this.playerRef.current!.getVideoElement() as HTMLVideoElement;
            if (nextProps.subtitleVisibility === 'showing' && nextProps.defaultSubtitleLang) {
                showLocalizedTextTrack(videoEl, nextProps.defaultSubtitleLang);
            } else {
                hideAllTextTracks(videoEl);
            }
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

    onCanPlay = (e: SyntheticEvent<HTMLVideoElement>) => {
        // Initialize state for tracks
        const videoEl = e.currentTarget as HTMLVideoElement;
        if (this.props.subtitleVisibility === 'showing' && this.props.defaultSubtitleLang) {
            showLocalizedTextTrack(videoEl, this.props.defaultSubtitleLang);
        } else {
            hideAllTextTracks(videoEl);
        }
    };

    render() {
        const { crossOrigin, disablePoster, className, muted, loop, videoProxy, defaultSubtitleLang } = this.props;

        let firstCover = null;
        let videoSources = null;
        if (videoProxy instanceof VideoProxy) {
            firstCover = videoProxy.getFirstCover();
            videoSources = mapVideoSourceProxyToVideoSourceProps(videoProxy.getSources());
        } else {
            videoSources = mapAudioProxyToVideoSourceProps(videoProxy);
        }
        const textTracks = mapMediaProxyTracksToTextTracksProps(videoProxy, defaultSubtitleLang);

        return (
            <VideoPlayer
                ref={this.playerRef}
                style={this.props.style}
                playing={true}
                controls={false}
                playsInline={true}
                crossOrigin={crossOrigin}
                onEnded={this.props.onEnded}
                onCanPlay={this.onCanPlay}
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
    langToSetAsDefault?: string | null
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
