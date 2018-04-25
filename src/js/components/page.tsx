import * as React from 'react';
import './page.scss';
import { PageOverlay } from '@src/components/page-overlay';
import { PageEntity } from '@src/repositories/data-proxy';
import { IDataVideo } from '@data/data-videos';

export interface PageProps {
    pageEntity: PageEntity;
}

interface PageState {}

export class VideoComp extends React.Component<{ video: IDataVideo }, {}> {
    videoNode!: HTMLVideoElement;

    render() {
        const { video } = this.props;
        const muted = true;
        const controls = false;
        const autoPlay = false;
        const loop = true;
        return (
            <div className="page-video-container">
                {video.video_id}
                <video
                    ref={(node: HTMLVideoElement) => {
                        this.videoNode = node;
                    }}
                    muted={muted}
                    loop={loop}
                    controls={controls}
                    autoPlay={autoPlay}
                    webkit-playsinline="webkit-playsinline"
                >
                    <source src={video.sources.webm} type="video/webm; codecs=vp9" />
                    <source src={video.sources.mp4} type="video/mp4" />
                </video>
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
                        <div className="page-header">{page.pageId}</div>
                        <div className="page-content">
                            <div className="page-video-layout">
                                Page {page.pageId}
                                {videos.map(video => {
                                    return <VideoComp key={video.video_id} video={video} />;
                                })}
                            </div>
                        </div>
                        <div className="page-footer">Here the player controls</div>
                    </div>
                </div>
            </PageOverlay>
        );
    }
}
