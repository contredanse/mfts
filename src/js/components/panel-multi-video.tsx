import React, { MouseEvent } from 'react';
import VideoProxyPlayer from '@src/components/player/data-proxy-player';
import VideoProxy from '@src/models/proxy/video-proxy';
import PageProxy from '@src/models/proxy/page-proxy';
import './panel-multi-video.scss';

type PanelMultiVideoProps = {
    videos: VideoProxy[];
    pageProxy: PageProxy;
    playing?: boolean;
    playbackRate?: number;
};

type PanelMultiVideoState = {};

const defaultProps = {
    playing: true,
    playbackRate: 1,
};

export default class PanelMultiVideo extends React.Component<PanelMultiVideoProps, PanelMultiVideoState> {
    static defaultProps: Partial<PanelMultiVideoProps> = defaultProps;

    constructor(props: PanelMultiVideoProps) {
        super(props);
    }

    render() {
        const { pageProxy, playing, playbackRate } = this.props;
        const videos = pageProxy.getVideos();

        let sizeConstraints = {
            width: '100%',
            height: 'auto',
        };

        // If there's only one video we need to swap width and height
        // values
        if (videos.length === 1) {
            sizeConstraints = {
                width: 'auto',
                height: '100%',
            };
        }
        return (
            <div className="panel-multi-video">
                {videos.map((video, idx) => {
                    const videoIdx = `video-${idx}`;
                    const className = 'autoscale-video-container';
                    let videoClassName = 'autoscale-video-wrapper autoscale-video-content';
                    if (video.hasVideoLink()) {
                        videoClassName += ' clickable-video';
                    }

                    return (
                        <div key={videoIdx} className={className} onClick={this.handleVideoClick}>
                            <VideoProxyPlayer
                                crossOrigin={'anonymous'}
                                className={videoClassName}
                                disableSubtitles={true}
                                videoProxy={video}
                                {...sizeConstraints}
                                // To prevent blinking
                                disablePoster={true}
                                playing={playing}
                                playbackRate={playbackRate}
                                loop
                                muted
                            />

                            {/*
                            <div className="loading-overlay" />
                            */}
                        </div>
                    );
                })}
            </div>
        );
    }

    protected handleVideoClick = (e: MouseEvent<HTMLDivElement>): void => {
        const target = e.target;
        console.log('CLICKING VIDEO LINK', target);
    };
}
