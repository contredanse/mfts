import React from 'react';
import ReactPlayer, {
    Config as ReactPlayerConfig,
    FileConfig as ReactPlayerFileConfig,
    ReactPlayerProps,
    SourceProps as ReactPlayerSourceProps,
    TrackProps as ReactPlayerTrackProps,
} from 'react-player';

import VideoEntity from '@src/models/entity/video-entity';
import VideoSourceEntity from '@src/models/entity/video-source-entity';

type VideoPlayerProps = {
    video: VideoEntity;
    disableSubtitles?: boolean;
    activeSubtitleLang?: string;
    crossOrigin?: 'anonymous';
} & ReactPlayerProps;

type VideoPlayerState = {};

export default class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {
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
        if (nextProps.video.videoId !== this.props.video.videoId) {
            return true;
        }
        // To be tested, a better solution must be found
        if (nextProps.activeSubtitleLang !== this.props.activeSubtitleLang) {
            return true;
        }
        return false;
    }

    render() {
        const { video, activeSubtitleLang, disableSubtitles, crossOrigin, ...playerProps } = this.props;

        const playerSources = this.getReactPlayerSources(video.getSources());

        const playerConfig = this.getReactPlayerConfig(video, activeSubtitleLang || 'en');

        // @todo remove when https://github.com/CookPete/react-player/pull/482 is merged
        if (this.playerRef.current !== null) {
            console.log('VideoPlayer rerender, setting srcObject to null');
            const videoEl = this.playerRef.current!.getInternalPlayer() as HTMLVideoElement;
            // This bug in firefox... we need to reset texttracks
            this.hideAllSubtitles(videoEl);
            videoEl.srcObject = null;
        }

        return (
            <ReactPlayer
                ref={this.playerRef}
                onStart={() => {
                    // When the video starts activate the text track
                    // this bug is realtes to
                    const video = this.playerRef.current!.getInternalPlayer() as HTMLVideoElement;
                    const { activeSubtitleLang: lang } = this.props;
                    if (lang !== undefined) {
                        // This bug in firefox... we need to reset texttracks whoing
                        this.showSubtitle(video, lang);
                    }
                }}
                playsinline={true}
                {...playerProps}
                url={playerSources}
                config={playerConfig}
            />
        );
    }

    protected hideAllSubtitles(video: HTMLVideoElement): void {
        for (let i = 0; i < video.textTracks.length; i++) {
            console.log('Hidding', video.textTracks[i]);
            video.textTracks[i].mode = 'hidden';
            console.log('New value', video.textTracks[i]);
        }
    }

    protected showSubtitle(video: HTMLVideoElement, lang: string): void {
        for (let i = 0; i < video.textTracks.length; i++) {
            // For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
            if (video.textTracks[i].language === lang) {
                console.log('SHOWING', video.textTracks[i]);
                video.textTracks[i].mode = 'showing';
                //this.setAttribute('data-state', 'active');
            } else {
                video.textTracks[i].mode = 'hidden';
            }
        }
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
