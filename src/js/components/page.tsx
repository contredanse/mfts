import * as React from 'react';
import './page.scss';
import { PageOverlay } from '@src/components/page-overlay';
import { PageEntity } from '@src/repositories/data-proxy';
import { IDataVideo } from '@data/data-videos';

export interface PageProps {
    pageEntity: PageEntity;
}

interface PageState {}

export interface VideoCompProps {
    video: IDataVideo;
    autoPlay?: boolean;
    onEnd?: () => {};
}

export class VideoComp extends React.Component<VideoCompProps, {}> {
    static defaultProps: Partial<VideoCompProps> = {
        autoPlay: true,
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
            this.videoNode.play();
        }
    }

    componentWillUnmount() {
        if (this.props.onEnd !== undefined) {
            this.videoNode.removeEventListener('ended', this.props.onEnd);
        }
    }

    render() {
        const { video, autoPlay, ...restProps } = this.props;
        const muted = true;
        const controls = true;
        const loop = true;

        const videoProps = {
            poster: video.covers !== undefined ? video.covers[0] : '',
        };

        const { meta } = video;
        const videoDuration = `${Math.trunc(meta.duration / 60)}:${Math.round(meta.duration) % 60}`;

        return (
            <div className="page-video-container">
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
                    <source src={video.sources.webm} type="video/webm; codecs=vp9" />
                    <source src={video.sources.mp4} type="video/mp4" />
                </video>
                <div className="overlay">
                    <div>{video.video_id}</div>
                    <div>{videoDuration}</div>
                </div>
            </div>
        );
    }
}

export default class Page extends React.Component<PageProps, PageState> {
    render() {
        const { pageEntity: page } = this.props;
        const videos = page.getVideos();

        return (
            <PageOverlay closeButton={false}>
                <div className="page-wrapper">
                    <div className="page-container">
                        <div className="page-header">Page: {page.pageId}</div>
                        <div className="page-content">
                            <div className="page-video-layout">
                                {videos.map(video => {
                                    return <VideoComp key={video.video_id} video={video} />;
                                })}
                            </div>
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
