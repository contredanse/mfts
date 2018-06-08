import React, { CSSProperties } from 'react';
import ReactPlayer, {
    Config as ReactPlayerConfig,
    FileConfig as ReactPlayerFileConfig,
    ReactPlayerProps,
    SourceProps as ReactPlayerSourceProps,
    TrackProps as ReactPlayerTrackProps,
} from 'react-player';

import VideoEntity from '@src/models/entity/video-entity';
import VideoSourceEntity from '@src/models/entity/video-source-entity';

type PageVideoPlayerProps = {
    video: VideoEntity;
    disableSubtitles?: boolean;
    activeSubtitleLang?: string;
    crossOrigin?: 'anonymous';
} & ReactPlayerProps;

type PageVideoPlayerState = {};

export default class PageVideoPlayer extends React.Component<PageVideoPlayerProps, PageVideoPlayerState> {
    protected playerRef: React.RefObject<ReactPlayer>;
    protected playerConfig: ReactPlayerConfig;
    protected playerSources: ReactPlayerSourceProps[];

    constructor(props: PageVideoPlayerProps) {
        super(props);
        this.playerRef = React.createRef<ReactPlayer>();
        this.playerConfig = this.getReactPlayerConfig(props.video, props.activeSubtitleLang || 'en');
        this.playerSources = this.getReactPlayerSources(props.video.getSources());
    }

    getHTMLVideoElement(): HTMLVideoElement | null {
        if (!this.playerRef.current) {
            return null;
        }
        return this.playerRef.current.getInternalPlayer() as HTMLVideoElement;
    }

    render() {
        const { video, activeSubtitleLang, disableSubtitles, crossOrigin, ...playerProps } = this.props;

        /*
        const videoLink = video.videoLink;
        if (videoLink) {
            style=
        }
        */

        return (
            <ReactPlayer
                ref={this.playerRef}
                playsinline={true}
                {...playerProps}
                url={this.playerSources}
                config={this.playerConfig}
            />
        );
    }

    protected getReactPlayerSources(videoSources: VideoSourceEntity[]): ReactPlayerSourceProps[] {
        const sources = videoSources.reduce(
            (acc, source) => {
                return [
                    ...acc,
                    {
                        src: source.getSource(),
                        type: source.getHtmlVideoTypeValue(),
                    },
                ];
            },
            [] as ReactPlayerSourceProps[]
        );
        return sources;
    }

    /**
     * Get config for video tracks, covers, cross-origin policy...
     * @param {VideoEntity} video
     * @param {string} defaultTrackLang
     */
    protected getReactPlayerConfig(video: VideoEntity, defaultTrackLang: string): ReactPlayerConfig {
        const playerTracks = !this.props.disableSubtitles
            ? this.getReactPlayerTracksConfig(video, defaultTrackLang)
            : null;

        const fileConfig: ReactPlayerFileConfig = {
            attributes: {
                ...(video.hasCover() ? { poster: video.getFirstCover() } : {}),
                ...(this.props.crossOrigin ? { crossOrigin: this.props.crossOrigin } : {}),
            },
            ...(playerTracks ? { tracks: playerTracks } : {}),
        };

        return { file: fileConfig };
    }

    protected getReactPlayerTracksConfig(video: VideoEntity, defaultTrackLang: string): ReactPlayerTrackProps[] | null {
        if (!video.hasTrack()) {
            return null;
        }
        const playerTracks: ReactPlayerTrackProps[] = [];
        video.getAllTracks().forEach(videoTrack => {
            playerTracks.push({
                kind: 'subtitles',
                src: videoTrack.src,
                srcLang: videoTrack.lang,
                default: defaultTrackLang === videoTrack.lang,
                label: videoTrack.lang,
            } as ReactPlayerTrackProps);
        });
        return playerTracks;
    }
}
