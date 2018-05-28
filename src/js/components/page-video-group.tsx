import React from 'react';
import PageVideoPlayer from '@src/components/page-video-player';
import VideoEntity from '@src/models/entity/video-entity';

type PageVideoGroupProps = {
    videos: VideoEntity[];
    playbackState?: {
        playing?: boolean;
        playbackRate?: number;
    };
};

type PageVideoGroupState = {};

export default class PageVideoGroup extends React.Component<PageVideoGroupProps, PageVideoGroupState> {
    private playerRefs!: Array<React.RefObject<PageVideoPlayer>>;

    static defaultProps: Partial<PageVideoGroupProps> = {
        playbackState: {
            playing: true,
            playbackRate: 1,
        },
    };

    constructor(props: PageVideoGroupProps) {
        super(props);
        this.initializeRefs();
    }

    render() {
        const { videos, playbackState } = this.props;
        return (
            <>
                {videos.map((video, video_idx) => {
                    const videoIdx = `video-${video_idx}`;
                    return (
                        <PageVideoPlayer
                            video={video}
                            key={videoIdx}
                            width="100%"
                            height="100%"
                            playing={playbackState!.playing}
                            playbackRate={playbackState!.playbackRate}
                            loop={true}
                            muted={true}
                        />
                    );
                })}
            </>
        );
    }

    protected initializeRefs(): void {
        this.playerRefs = [];
        this.props.videos.forEach(video => {
            this.playerRefs[video.videoId] = React.createRef();
        });
    }
}
