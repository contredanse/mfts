import React from 'react';
import VideoPlayer from '@src/components/player/video-player';
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
            <div className="page-video-wall">
                {videos.map((video, idx) => {
                    const videoIdx = `video-${idx}`;
                    const className = 'autoscale-video-container';
                    let videoClassName = 'autoscale-video-wrapper autoscale-video-content';
                    if (video.videoLink) {
                        videoClassName += ' clickable-video';
                    }

                    const coverImg = video.getFirstCover();

                    const containerStyle = {
                        //backgroundImage: `url(${coverImg})`,
                        //backgroundSize: 'contain',
                        //backgroundRepeat: 'cover'
                    };

                    return (
                        <div key={videoIdx} className={className} style={containerStyle}>
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
                                    console.log('duration');
                                }}
                                playing={playbackState!.playing}
                                playbackRate={playbackState!.playbackRate}
                                loop
                                muted
                            />

                            <div className="loading-overlay" />
                        </div>
                    );
                })}
            </div>
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
