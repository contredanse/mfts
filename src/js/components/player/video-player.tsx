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
import { hideAllSubtitles, showSubtitle } from '@src/components/player/subtitles-actions';

type VideoPlayerProps = {
    video: VideoProxy;
    disablePoster?: boolean;
    disableSubtitles?: boolean;
    activeSubtitleLang?: string;
    crossOrigin?: 'anonymous';
    fallbackLang?: string;
} & ReactPlayerProps;

type VideoPlayerState = {
    initialized: boolean;
    video: VideoProxy;
    activeSubtitleLang?: string;
    playerConfig: ReactPlayerConfig;
    playerSources: ReactPlayerSourceProps[];
};

export default class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {
    static defaultProps: Partial<VideoPlayerProps> = {
        disablePoster: false,
        disableSubtitles: false,
        fallbackLang: 'en',
    };

    readonly state: VideoPlayerState;

    protected playerRef: React.RefObject<ReactPlayer>;

    constructor(props: VideoPlayerProps) {
        super(props);
        this.playerRef = React.createRef<ReactPlayer>();
        this.state = {
            initialized: false,
        } as VideoPlayerState;
    }

    static getDerivedStateFromProps(nextProps: VideoPlayerProps, prevState: VideoPlayerState): VideoPlayerState | null {
        const { initialized } = prevState;
        if (
            !initialized ||
            prevState.activeSubtitleLang !== nextProps.activeSubtitleLang ||
            prevState.video.videoId !== nextProps.video.videoId
        ) {
            const { video, activeSubtitleLang, disableSubtitles, crossOrigin, disablePoster } = nextProps;
            const playerSources = getReactPlayerSources(video.getSources());
            return {
                initialized: true,
                activeSubtitleLang: nextProps.activeSubtitleLang,
                video: nextProps.video,
                playerSources: playerSources,
                playerConfig: getReactPlayerConfig(video, activeSubtitleLang || (nextProps.fallbackLang as string), {
                    disableSubtitles: disableSubtitles,
                    crossOrigin: crossOrigin,
                    disablePoster: disablePoster,
                }),
            };
        } else {
            // console.log('NOT CALLING GETDERIVEDSTATEFROMPROPS');
        }

        // Return null to indicate no change to state.
        return null;
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
            return true;
        }

        if (nextProps.playbackRate !== this.props.playbackRate) {
            console.log('NEXTPROPS', nextProps.playbackRate);
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

        const { playerSources, playerConfig } = this.state;
        console.log('rerednersdfsdfsdf', playerSources);
        return (
            <ReactPlayer
                //key={video.videoId}
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
}

const getReactPlayerSources = (videoSources: VideoSourceProxy[]): ReactPlayerSourceProps[] => {
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
        [] as ReactPlayerSourceProps[]
    );
};

const getReactPlayerConfig = (
    video: VideoProxy,
    defaultTrackLang: string,
    params: Pick<VideoPlayerProps, 'crossOrigin' | 'disablePoster' | 'disableSubtitles'>
): ReactPlayerConfig => {
    const playerTracks = !params.disableSubtitles ? getReactPlayerTracksConfig(video, defaultTrackLang) : null;
    const fileConfig: ReactPlayerFileConfig = {
        attributes: {
            ...(!params.disablePoster && video.hasCover() ? { poster: video.getFirstCover() } : {}),
            ...(params.crossOrigin !== undefined ? { crossOrigin: params.crossOrigin } : {}),
        },
        ...(playerTracks !== null ? { tracks: playerTracks } : {}),
    };

    return { file: fileConfig };
};

const getReactPlayerTracksConfig = (video: VideoProxy, defaultTrackLang: string): ReactPlayerTrackProps[] | null => {
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
};
