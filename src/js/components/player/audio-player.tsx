import React from 'react';
import ReactPlayer, {
    Config as ReactPlayerConfig,
    FileConfig as ReactPlayerFileConfig,
    ReactPlayerProps,
    SourceProps as ReactPlayerSourceProps,
    TrackProps as ReactPlayerTrackProps,
} from 'react-player';
import AudioEntity from '../../models/entity/audio-entity';

type AudioPlayerProps = {
    audio: AudioEntity;
    lang?: string;
} & ReactPlayerProps;

type AudioPlayerState = {};

export default class AudioPlayer extends React.Component<AudioPlayerProps, AudioPlayerState> {
    protected playerRef: React.RefObject<ReactPlayer>;
    protected playerConfig: ReactPlayerConfig;
    protected playerSources: ReactPlayerSourceProps[];

    constructor(props: AudioPlayerProps) {
        super(props);
        this.playerRef = React.createRef();
        const currentLang = 'en';
        this.playerConfig = this.getReactPlayerConfig(props.audio, currentLang);

        // Warning this is an hack...
        // - audio/mp3 works on desktops but not on mobile
        // - video/mp4 works on desktops
        const audioMimeType = 'video/mp4';

        this.playerSources = [
            {
                src: props.audio.getSourceFile()!,
                type: audioMimeType,
            },
        ];
    }

    getHTMLVideoElement(): HTMLVideoElement | null {
        if (!this.playerRef.current) {
            return null;
        }
        return this.playerRef.current.getInternalPlayer() as HTMLVideoElement;
    }

    render() {
        const { audio, lang, ...playerProps } = this.props;

        return (
            <ReactPlayer
                ref={this.playerRef}
                playsinline={true}
                playing={true}
                {...playerProps}
                url={this.playerSources}
                config={this.playerConfig}
            />
        );
    }

    protected getReactPlayerConfig(audio: AudioEntity, currentLang: string): ReactPlayerConfig {
        const defaultFileConfig: ReactPlayerFileConfig = {
            forceVideo: true,
            attributes: {
                crossOrigin: 'anonymous',
            },
        };
        const fileConfig = defaultFileConfig;
        if (audio.hasTrack()) {
            const playerTracks: ReactPlayerTrackProps[] = [];
            audio.getAllTracks().forEach(audioTrack => {
                playerTracks.push({
                    kind: 'subtitles',
                    src: audioTrack.src,
                    srcLang: audioTrack.lang,
                    default: currentLang === audioTrack.lang,
                    label: audioTrack.lang,
                } as ReactPlayerTrackProps);
            });

            fileConfig.tracks = playerTracks;
        }

        return { file: fileConfig };
    }
}
