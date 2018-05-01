import * as React from 'react';
import './page.scss';
import { PageOverlay } from '@src/components/page-overlay';
import PageEntity from '@src/data/page-entity';
import VideoEntity from '@src/data/video-entity';

export interface PageProps {
    pageEntity: PageEntity;
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
        console.log('page', page);
        console.log('videos', videos);
        return (
            <PageOverlay closeButton={false}>
                <div className="page-wrapper">
                    <div className="page-container">
                        <div className="page-header">Page: {page.pageId}</div>
                        <div className="page-content">
                            <div className="page-video-layout">
                                {videos.map(video => {
                                    return <VideoComp key={video.videoId} video={video} />;
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
