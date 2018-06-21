import React, { MouseEvent } from 'react';
import VideoPlayer from '@src/components/player/video-player';
import VideoEntity from '@src/models/entity/video-entity';
import PageEntity from '@src/models/entity/page-entity';
import './panel-mutli-video.scss';

type PanelMultiVideoProps = {
    videos: VideoEntity[];
    pageEntity: PageEntity;
    playbackState?: {
        playing?: boolean;
        playbackRate?: number;
    };
};

type PanelMultiVideoState = {};

const defaultProps = {
    playbackState: {
        playing: true,
        playbackRate: 1,
    },
};

export default class PanelMultiVideo extends React.Component<PanelMultiVideoProps, PanelMultiVideoState> {
    static defaultProps: Partial<PanelMultiVideoProps> = defaultProps;

    constructor(props: PanelMultiVideoProps) {
        super(props);
    }

    handleVideoClick = (e: MouseEvent<HTMLDivElement>): void => {
        const target = e.target;
        console.log('CLICKING VIDEO LINK', target);
    };

    render() {
        const { pageEntity, playbackState } = this.props;
        const videos = pageEntity.getVideos();
        return (
            <div className="panel-multi-video">
                {videos.map((video, idx) => {
                    const videoIdx = `video-${idx}`;
                    const className = 'autoscale-video-container';
                    let videoClassName = 'autoscale-video-wrapper autoscale-video-content';
                    if (video.hasVideoLink()) {
                        videoClassName += ' clickable-video';
                    }
                    const coverImg = video.getFirstCover();

                    const containerStyle = {};

                    return (
                        <div
                            key={videoIdx}
                            className={className}
                            style={containerStyle}
                            onClick={this.handleVideoClick}
                        >
                            <VideoPlayer
                                crossOrigin={'anonymous'}
                                className={videoClassName}
                                disableSubtitles={true}
                                video={video}
                                width="100%"
                                height="auto"
                                preload="preload"
                                onDuration={duration => {
                                    // Metadata have been loaded, the browser
                                    // knows the duration and dimensions too
                                    // Layout is probably already calculated
                                    // Let's remove the loading overlay
                                    // console.log('duration');
                                }}
                                playing={playbackState!.playing}
                                playbackRate={playbackState!.playbackRate}
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
}
