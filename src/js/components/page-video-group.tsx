import React from 'react';
import PageVideoPlayer from '@src/components/page-video-player';
import VideoEntity from '@src/models/entity/video-entity';
import PageEntity from '@src/models/entity/page-entity';

type PageVideoGroupProps = {
    videos: VideoEntity[];
    pageEntity: PageEntity;
    playbackState?: {
        playing?: boolean;
        playbackRate?: number;
    };
};

type PageVideoGroupState = {};

const defaultProps = {
    playbackState: {
        playing: true,
        playbackRate: 1,
    },
};

export default class PageVideoGroup extends React.Component<PageVideoGroupProps, PageVideoGroupState> {
    static defaultProps: Partial<PageVideoGroupProps> = defaultProps;

    constructor(props: PageVideoGroupProps) {
        super(props);
    }

    render() {
        const { pageEntity, playbackState } = this.props;
        const videos = pageEntity.getVideos();
        return (
            <>
                {videos.map((video, idx) => {
                    const videoIdx = `video-${idx}`;
                    let className = 'autoscale-video-container';
                    if (video.videoLink) {
                        className = 'video-link';
                    }
                    return (
                        <div key={videoIdx} className={className}>
                            <PageVideoPlayer
                                crossOrigin={'anonymous'}
                                className="autoscale-video-wrapper autoscale-video-content"
                                disableSubtitles={true}
                                video={video}
                                width="100%"
                                height="100%"
                                playing={playbackState!.playing}
                                playbackRate={playbackState!.playbackRate}
                                loop
                                muted
                            />
                        </div>
                    );
                })}
            </>
        );
    }

    /*
    protected initializeRefs(): void {
        this.playerRefs = [];
        this.props.videos.forEach(video => {
            this.playerRefs[video.videoId] = React.createRef();
        });
    }*/
}
