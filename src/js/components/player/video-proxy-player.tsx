import React, { forwardRef } from 'react';
import ReactPlayer, {
    Config as ReactPlayerConfig,
    FileConfig as ReactPlayerFileConfig,
    ReactPlayerProps,
} from 'react-player';

import VideoProxy from '@src/models/proxy/video-proxy';
import VideoSourceProxy from '@src/models/proxy/video-source-proxy';
import { showLocalizedTextTrack } from '@src/components/player/controls/utils/video-texttrack-helpers';
import BasicVideoPlayer, { TextTrackProps, VideoSourceProps } from '@src/components/player/basic-video-player';

export type VideoProxyPlayerProps = {
    video: VideoProxy;
    disablePoster?: boolean;
    disableSubtitles?: boolean;
    activeSubtitleLang?: string;
    crossOrigin?: 'anonymous';
    fallbackLang?: string;
} & ReactPlayerProps;

export type VideoProxyPlayerState = {
    initialized: boolean;
    video: VideoProxy;
    activeSubtitleLang?: string;
    playerConfig: ReactPlayerConfig;
    playerSources: VideoSourceProps[];
};

export default class VideoProxyPlayer extends React.Component<VideoProxyPlayerProps, VideoProxyPlayerState> {
    static defaultProps: Partial<VideoProxyPlayerProps> = {
        disablePoster: false,
        disableSubtitles: false,
        fallbackLang: 'en',
    };

    readonly state: VideoProxyPlayerState;

    //protected playerRef: React.RefObject<ReactPlayer>;
    protected playerRef: React.RefObject<BasicVideoPlayer>;

    constructor(props: VideoProxyPlayerProps) {
        super(props);
        //this.playerRef = React.createRef<ReactPlayer>();
        this.playerRef = React.createRef<BasicVideoPlayer>();
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
        return this.playerRef.current.getVideoElement() as HTMLVideoElement;
    }

    shouldComponentUpdate(nextProps: VideoProxyPlayerProps, nextState: VideoProxyPlayerState): boolean {
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
            const videoEl = this.playerRef.current!.getVideoElement() as HTMLVideoElement;
            showLocalizedTextTrack(videoEl, nextProps.activeSubtitleLang || nextProps.fallbackLang!);
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
            onDuration,
            playsInline,
            onStart,
            playing,
            onReady,
            ...playerProps
        } = this.props;

        const { playerSources, playerConfig } = this.state;

        const tracks: TextTrackProps[] = playerConfig.file!.tracks as TextTrackProps[];

        return (
            <BasicVideoPlayer
                //key={video.videoId}
                style={this.props.style}
                ref={this.playerRef}
                autoPlay={true}
                controls={false}
                playsInline={true}
                crossOrigin={'anonymous'}
                srcs={playerSources}
                {...(tracks ? { tracks } : {})}
            />
        );
    }
}

const getReactPlayerSources = (videoSources: VideoSourceProxy[]): VideoSourceProps[] => {
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

const getReactPlayerConfig = (
    video: VideoProxy,
    defaultTrackLang: string,
    params: Pick<VideoProxyPlayerProps, 'crossOrigin' | 'disablePoster' | 'disableSubtitles'>
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

const getReactPlayerTracksConfig = (video: VideoProxy, defaultTrackLang: string): TextTrackProps[] | null => {
    if (!video.hasTrack()) {
        return null;
    }
    const playerTracks: TextTrackProps[] = [];
    video.getAllTracks().forEach(videoTrack => {
        playerTracks.push({
            kind: 'subtitles',
            src: videoTrack.src,
            srcLang: videoTrack.lang,
            default: defaultTrackLang === videoTrack.lang,
            label: videoTrack.lang,
        });
    });
    return playerTracks;
};
