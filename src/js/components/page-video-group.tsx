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

export default class PageVideoGroup extends React.Component<PageVideoGroupProps, PageVideoGroupState> {
    //private playerRefs!: Array<React.RefObject<PageVideoPlayer>>;

    static defaultProps: Partial<PageVideoGroupProps> = {
        playbackState: {
            playing: true,
            playbackRate: 1,
        },
    };

    constructor(props: PageVideoGroupProps) {
        super(props);
        //this.initializeRefs();
    }

    render() {
        const { pageEntity, playbackState } = this.props;
        const videos = pageEntity.getVideos();
        return (
            <>
                {videos.map((video, video_idx) => {
                    const videoIdx = `video-${video_idx}`;
                    let className = '';
                    if (video.videoLink) {
                        className = 'video-link';
                    }
                    return (
                        <div key={videoIdx} className={className}>
                            <PageVideoPlayer
                                crossOrigin={'anonymous'}
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
