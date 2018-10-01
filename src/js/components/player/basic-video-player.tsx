import React, {
    CSSProperties,
    SourceHTMLAttributes,
    SyntheticEvent,
    TrackHTMLAttributes,
    VideoHTMLAttributes,
} from 'react';
import { Omit } from 'utility-types';
import equal from 'fast-deep-equal';
import { hideAllSubtitles } from '@src/components/player/controls/utils/subtitles-actions';

export type VideoSourcesProps = SourceHTMLAttributes<HTMLSourceElement>;
export type TracksSourcesProps = TrackHTMLAttributes<HTMLTrackElement>;

export type BasicVideoActions = {
    //onEnded?: (e: Event) => void;
    onEnded?: (e: SyntheticEvent<HTMLVideoElement>) => void;
};

export type BasicVideoProps = {
    srcs?: VideoSourcesProps[];
    tracks?: TracksSourcesProps[];
    playbackRate: number;
    forwardRef?: React.RefObject<HTMLVideoElement>;
} & Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'onEnded'> &
    BasicVideoActions;

export type BasicVideoState = {
    listenersRegistered: boolean;
};

const defaultProps = {
    playbackRate: 1,
    playsInline: true,
};

class BasicVideoPlayer extends React.Component<BasicVideoProps, BasicVideoState> {
    static defaultProps = defaultProps;

    private videoRef!: React.RefObject<HTMLVideoElement>;
    private listenersRegistered = false;

    constructor(props: BasicVideoProps) {
        super(props);

        if (this.props.forwardRef) {
            this.videoRef = this.props.forwardRef;
        } else {
            this.videoRef = React.createRef<HTMLVideoElement>();
        }
    }

    componentDidMount() {
        this.setPlaybackRate(this.props.playbackRate);
        if (this.videoRef.current !== null) {
            this.registerVideoListeners(this.videoRef.current);
        } else {
            throw Error('Registering listeners failed, video element is null');
        }
    }

    componentDidUpdate() {
        if (this.videoRef.current !== null) {
            const videoEl = this.videoRef.current;
            videoEl.load();
        }
    }

    componentWillUnmount() {
        if (this.videoRef.current !== null) {
            this.unregisterVideoListeners(this.videoRef.current);
        } else {
            throw Error('Unregistering listeners failed, video element is null');
        }
    }

    shouldComponentUpdate(nextProps: BasicVideoProps): boolean {
        let shouldUpdate = true;

        if (this.props.playbackRate !== nextProps.playbackRate) {
            this.setPlaybackRate(nextProps.playbackRate);
            shouldUpdate = false;
        }

        // Let's deep check src and tracks to see if we need
        // to recreate the video key
        if (!equal(nextProps.srcs, this.props.srcs) || !equal(nextProps.tracks, this.props.tracks)) {
            const video = this.getVideoElement()!;
            shouldUpdate = true;
        }

        //this.getVideoElement().load();
        return shouldUpdate;
    }

    setPlaybackRate(playbackRate: number): void {
        const videoEl = this.getVideoElement();
        if (videoEl !== null) {
            videoEl.playbackRate = playbackRate;
        }
    }

    getVideoElement(): HTMLVideoElement | null {
        return this.videoRef.current;
    }

    onLoadedMetadata = (e: SyntheticEvent<HTMLVideoElement>) => {
        const video = e.currentTarget;

        // As a workaround for Firefox, let's remove old tracks
        // before adding the new ones. Letting react do
        // the job does not seems to work properly
        hideAllSubtitles(video);
        const oldTracks = video.querySelectorAll('track');
        oldTracks.forEach(oldTrack => {
            video.removeChild(oldTrack);
        });

        if (this.props.tracks) {
            this.props.tracks.map((t, trackIdx) => {
                const track = document.createElement('track');
                track.kind = t.kind!;
                track.label = t.label!;
                track.srclang = t.srcLang!;
                track.default = t.default!;
                track.src = t.src!;
                track.addEventListener('error', (e: Event) => {
                    console.warn(`Cannot load track ${t.src!}`);
                });
                track.addEventListener('load', (e: Event) => {
                    const textTrack = e.currentTarget as HTMLTrackElement;
                    if (t.default === true) {
                        textTrack.track.mode = 'showing';
                        video.textTracks[trackIdx].mode = 'showing'; // thanks Firefox
                    } else {
                        textTrack.track.mode = 'hidden';
                        video.textTracks[trackIdx].mode = 'hidden'; // thanks Firefox
                    }
                });
                video.appendChild(track);
            });
        }
    };

    render() {
        const {
            srcs,
            tracks,
            // Just to omit those props
            playbackRate,
            // onEnded,
            ...mediaProps
        } = this.props;

        const key = srcs && srcs.length > 0 ? srcs[0].src : '';

        return (
            <video
                onLoadedMetadata={this.onLoadedMetadata}
                ref={this.videoRef}
                {...mediaProps}
                {...(this.props.playsInline ? { 'webkit-playsinline': 'webkit-playsinline' } : {})}
            >
                {srcs && srcs.map((s, idx) => <source key={`${s.src}-${idx}`} {...s} />)}
                {/*
                // This would be so easy, but subsequent changes in tracks will
                // be ignored by firefox. See the workaround onLoadedMetaData function
                {tracks && tracks.map((t, idx) => {
                    return null;
                  return (
                      <track id={`${t.src}-${idx}`} key={`${t.src}-${idx}`} {...t}/>
                  );
                })}
                */}
            </video>
        );
    }

    private registerVideoListeners(video: HTMLVideoElement, skipOnRegistered: boolean = true): void {
        if (skipOnRegistered && this.listenersRegistered) {
            return;
        }
        const { onEnded } = this.props;
        if (onEnded) {
            //video.addEventListener('ended', onEnded);
        }
        //video.addEventListener('ratechange', this.updateVolumeState);
        this.listenersRegistered = true;
    }

    private unregisterVideoListeners(video: HTMLVideoElement): void {
        if (this.listenersRegistered) {
            //video.removeEventListener('ratechange', this.updateVolumeState);
            this.listenersRegistered = false;
        }
    }
}

export default BasicVideoPlayer;
