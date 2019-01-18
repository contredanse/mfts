import React from 'react';
import './page-card.scss';
import VideoProxyPlayer from '@src/components/player/data-proxy-player';
import AudioProxy from '@src/models/proxy/audio-proxy';
import { ControlBarProps } from '@src/components/player/controls/control-bar';
import { TrackVisibilityMode } from '@src/components/player/track/track-visibility-helper';

type PagePanelAudioProps = {
    audioProxy: AudioProxy;
    subtitleLang: string;
    subtitleVisibility: TrackVisibilityMode;
    playing: boolean;
    onEnded: () => void;
    handlePlaybackChange: (isPlaying: boolean) => void;
    playerRef: React.RefObject<VideoProxyPlayer>;
    controlBarProps?: ControlBarProps;
};

type PagePanelAudioState = {};

const defaultProps = {};
const defaultState = {};

export default class PagePanelAudio extends React.PureComponent<PagePanelAudioProps, PagePanelAudioState> {
    static defaultProps = defaultProps;

    constructor(props: PagePanelAudioProps) {
        super(props);
        this.state = defaultState;
    }

    render() {
        const {
            audioProxy,
            subtitleLang,
            subtitleVisibility,
            playing,
            controlBarProps,
            playerRef,
            handlePlaybackChange,
            onEnded,
        } = this.props;

        return (
            <div className="panel-audio-subs">
                <VideoProxyPlayer
                    ref={playerRef}
                    style={{ width: '100%', height: '100%' }}
                    crossOrigin={'anonymous'}
                    defaultSubtitleLang={subtitleLang}
                    subtitleVisibility={subtitleVisibility}
                    disablePoster={true}
                    videoProxy={audioProxy}
                    playing={playing}
                    onPlaybackChange={handlePlaybackChange}
                    onEnded={onEnded}
                    controlBarProps={controlBarProps}
                />
            </div>
        );
    }
}

/*
export const ForwardedPagePanelAudio = React.forwardRef((props: PagePanelAudioProps, ref) => {
    return <PagePanelAudio {...props} forwardedRef={ref} />;
});
*/
