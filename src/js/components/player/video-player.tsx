import React from 'react';
import ReactPlayer, {
    Config as ReactPlayerConfig,
    FileConfig as ReactPlayerFileConfig,
    ReactPlayerProps,
    SourceProps as ReactPlayerSourceProps,
    TrackProps as ReactPlayerTrackProps,
} from 'react-player';

import VideoProxy from '@src/models/proxy/video-proxy';
import VideoSourceProxy from '@src/models/proxy/video-source-proxy';
import { hideAllSubtitles, showSubtitle } from '@src/components/player/utils';

type VideoPlayerProps = {
    video: VideoProxy;
    disablePoster?: boolean;
    disableSubtitles?: boolean;
    activeSubtitleLang?: string;
    crossOrigin?: 'anonymous';
    fallbackLang?: string;
} & ReactPlayerProps;

type VideoPlayerState = {};

export default class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {
    static defaultProps: Partial<VideoPlayerProps> = {
        disablePoster: false,
        disableSubtitles: false,
        fallbackLang: 'en',
    };

    protected playerRef: React.RefObject<ReactPlayer>;

    constructor(props: VideoPlayerProps) {
        super(props);
        this.playerRef = React.createRef<ReactPlayer>();
    }

    getHTMLVideoElement(): HTMLVideoElement | null {
        if (!this.playerRef.current) {
            return null;
        }
        return this.playerRef.current.getInternalPlayer() as HTMLVideoElement;
    }

    shouldComponentUpdate(nextProps: VideoPlayerProps, nextState: VideoPlayerState): boolean {
        // A new video have been given
        if (nextProps.video.videoId !== this.props.video.videoId) {
            // @todo remove when https://github.com/CookPete/react-player/pull/482 is merged
            if (this.playerRef.current !== null) {
                console.log('VideoPlayer rerender, hiding subs and setting srcObject to null');
                const videoEl = this.playerRef.current!.getInternalPlayer() as HTMLVideoElement;
                // This bug in firefox... we need to reset texttracks
                hideAllSubtitles(videoEl);
                //videoEl.srcObject = null;
                videoEl.load();
            }
            return true;
        }

        if (nextProps.playbackRate !== this.props.playbackRate) {
            return true;
        }

        // To be tested, a better solution must be found
        if (nextProps.activeSubtitleLang !== this.props.activeSubtitleLang) {
            const videoEl = this.playerRef.current!.getInternalPlayer() as HTMLVideoElement;
            showSubtitle(videoEl, nextProps.activeSubtitleLang || nextProps.fallbackLang!);
            return false;
        }
        return false;
    }

    render() {
        const {
            video,
            activeSubtitleLang,
            disablePoster,
            disableSubtitles,
            crossOrigin,
            fallbackLang,
            ...playerProps
        } = this.props;

        const playerSources = this.getReactPlayerSources(video.getSources());

        const playerConfig = this.getReactPlayerConfig(video, activeSubtitleLang || 'en', {
            disableSubtitles: disableSubtitles,
            crossOrigin: crossOrigin,
            disablePoster: disablePoster,
        });

        return (
            <ReactPlayer
                key={playerSources[0].src}
                ref={this.playerRef}
                onStart={() => {
                    // When the video starts activate the text track
                    const v = this.playerRef.current!.getInternalPlayer() as HTMLVideoElement;
                    if (disableSubtitles) {
                        hideAllSubtitles(v);
                    } else {
                        // This bug in firefox... we need to reset texttracks whoing
                        const { activeSubtitleLang: lang } = this.props;
                        if (lang !== undefined) {
                            showSubtitle(v, lang);
                        }
                    }
                }}
                playsinline={true}
                {...playerProps}
                url={playerSources}
                config={playerConfig}
            />
        );
    }

    protected getReactPlayerSources(videoSources: VideoSourceProxy[]): ReactPlayerSourceProps[] {
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
     */
    protected getReactPlayerConfig(
        video: VideoProxy,
        defaultTrackLang: string,
        params: Pick<VideoPlayerProps, 'crossOrigin' | 'disablePoster' | 'disableSubtitles'>
    ): ReactPlayerConfig {
        const playerTracks = !params.disableSubtitles ? this.getReactPlayerTracksConfig(video, defaultTrackLang) : null;

        const fileConfig: ReactPlayerFileConfig = {
            attributes: {
                ...(!params.disablePoster && video.hasCover() ? { poster: video.getFirstCover() } : {}),
                ...(params.crossOrigin !== undefined ? { crossOrigin: params.crossOrigin } : {}),
            },
            ...(playerTracks !== null ? { tracks: playerTracks } : {}),
        };

        return { file: fileConfig };
    }

    protected getReactPlayerTracksConfig(video: VideoProxy, defaultTrackLang: string): ReactPlayerTrackProps[] | null {
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
