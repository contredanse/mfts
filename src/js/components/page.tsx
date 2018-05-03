import * as React from 'react';
import './page.scss';
import { PageOverlay } from '@src/components/page-overlay';
import PageEntity from '@src/model/page-entity';
import VideoEntity from '@src/model/video-entity';

export interface PageProps {
    pageEntity: PageEntity;
    lang: string;
}

interface PageState {}

export interface VideoCompProps {
    video: VideoEntity;
    autoPlay?: boolean;
    loop?: boolean;
    onEnd?: () => {};
}

export class VideoComp extends React.Component<VideoCompProps, {}> {
    static defaultProps: Partial<VideoCompProps> = {
        autoPlay: true,
        loop: false,
    };

    videoNode!: HTMLVideoElement;

    constructor(props: VideoCompProps) {
        super(props);
    }

    componentDidMount() {
        if (this.props.onEnd !== undefined) {
            this.videoNode.addEventListener('ended', this.props.onEnd, false);
        }
        if (this.props.autoPlay && this.videoNode.paused) {
            this.play();
        }
    }

    play() {
        if (this.videoNode !== undefined) {
            // specific behaviour
            if (this.videoNode.ended && this.videoNode.loop) {
                // assume metadata are loaded (videoNode.ended should do the trick)
                this.videoNode.currentTime = 0;
            }
            // play() is a promise... and can be rejected.
            const playedPromise = this.videoNode.play();
            if (playedPromise) {
                playedPromise.catch(e => {
                    if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
                        console.log('Cannot autoplay video due to platform restrictions');
                    }
                });
            }
        }
    }

    componentWillUnmount() {
        if (this.props.onEnd !== undefined) {
            this.videoNode.removeEventListener('ended', this.props.onEnd);
        }
    }

    render() {
        const { video, autoPlay, loop, ...restProps } = this.props;
        const muted = true;
        const controls = true;

        const videoProps = {
            poster: video.covers !== undefined ? video.covers[0] : '',
        };

        return (
            <div className="videocomp-container">
                <video
                    ref={(node: HTMLVideoElement) => {
                        this.videoNode = node;
                    }}
                    muted={muted}
                    loop={loop}
                    controls={controls}
                    autoPlay={autoPlay}
                    webkit-playsinline="webkit-playsinline"
                    {...videoProps}
                >
                    {video.getSources().map((sourceEntity, idx) => {
                        return <source key={idx} src={sourceEntity.src} type={sourceEntity.getHtmlTypeValue()} />;
                    })}
                </video>
                <div className="overlay">
                    <div>{video.videoId}</div>
                    <div>{video.getFormattedDuration()}</div>
                </div>
            </div>
        );
    }
}

export default class Page extends React.Component<PageProps, PageState> {
    render() {
        const { pageEntity: page } = this.props;
        const videos = page.videos;

        const audio = page.getAudioEntity();

        // Warning this is an hack...
        // - audio/mp3 works on desktops but not on mobile
        // - video/mp4 works on desktops
        const audioMimeType = 'video/mp4';

        return (
            <PageOverlay closeButton={false}>
                <div className="page-wrapper">
                    <div className="page-container">
                        <div className="page-header">Page: {page.pageId}</div>
                        <div className="page-content">
                            {page.countVideos() > 1 ? (
                                <div className="page-multi-video-layout">
                                    <div className="page-video-wall">
                                        {videos.map(video => {
                                            return (
                                                <VideoComp
                                                    key={video.videoId}
                                                    video={video}
                                                    loop={true}
                                                    autoPlay={false}
                                                />
                                            );
                                        })}
                                    </div>
                                    {audio && (
                                        <div className="page-audio-subs">
                                            <video controls={true} crossOrigin="anonymous">
                                                <source type={audioMimeType} src={audio.getSrc()} />
                                                {audio.getAllTracks().map(audioTrack => {
                                                    return (
                                                        <track
                                                            key={audioTrack.src}
                                                            label={audioTrack.lang}
                                                            kind="subtitles"
                                                            srcLang={audioTrack.lang}
                                                            src={audioTrack.src}
                                                            {...(this.props.lang == audioTrack.lang
                                                                ? { default: true }
                                                                : {})}
                                                        />
                                                    );
                                                })}
                                            </video>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="page-single-video-layout">
                                    <VideoComp video={page.getFirstVideo()} loop={false} />
                                </div>
                            )}
                        </div>
                        <div className="page-footer">
                            Here will come the player controls... and above subtitles when multiple videos
                        </div>
                    </div>
                </div>
            </PageOverlay>
        );
    }
}
