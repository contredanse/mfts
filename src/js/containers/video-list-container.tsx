import React from 'react';
import { VideoList } from '@src/components/video-list';
import { PageOverlay } from '@src/components/page-overlay';
import { SearchBox } from '@src/components/search-box';
import { ReactVideoPlayer } from '@src/components/react-video-player';
import { IJsonVideo } from '@data/json/data-videos';

type VideoListContainerProps = {
    initialData: IJsonVideo[];
    videosBaseUrl: string;
};

type VideoListContainerState = {
    videos: IJsonVideo[];
    selectedVideo?: IJsonVideo;
    searchFragment?: string;
};

class VideoListContainer extends React.Component<VideoListContainerProps, VideoListContainerState> {
    public static defaultProps = {};

    constructor(props: VideoListContainerProps) {
        super(props);
        this.state = {
            videos: this.props.initialData,
        };
    }

    updateSearch = e => {
        e.preventDefault();
        const fragment = e.target.value;
        const regex = new RegExp(fragment, 'i');
        const filtered = this.props.initialData.filter(videoData => {
            const content = videoData.video_id;
            return content.search(regex) > -1;
        });

        this.setState({
            videos: filtered,
            searchFragment: fragment,
        });
    };

    openVideo = (video: IJsonVideo) => {
        this.setState(state => ({
            ...state,
            selectedVideo: video,
        }));
    };

    closeVideo = () => {
        console.log('closing selected video');
        this.setState(state => ({
            ...state,
            selectedVideo: undefined,
        }));
    };

    render() {
        const { videos, selectedVideo } = this.state;
        const { videosBaseUrl } = this.props;
        const searchBoxStyle = {
            position: 'fixed',
            top: '70px',
            right: '25px',
            width: '150px',
        } as React.CSSProperties;

        let sourceMp4,
            sourceWebm,
            poster = '';
        if (selectedVideo !== undefined) {
            poster = `${videosBaseUrl}/${selectedVideo.video_id}.jpg`;

            sourceWebm = `${videosBaseUrl}/${selectedVideo.sources[0].src}`;
            sourceMp4 = `${videosBaseUrl}/${selectedVideo.sources[1].src}`;
        }
        return (
            <PageOverlay>
                {selectedVideo && (
                    <PageOverlay
                        closeButton={true}
                        onClose={() => {
                            this.closeVideo();
                        }}
                    >
                        <ReactVideoPlayer
                            poster={poster}
                            onEnd={() => {
                                this.closeVideo();
                            }}
                            autoPlay={true}
                            controls={true}
                        >
                            <source src={sourceWebm} type="video/webm; codecs=vp9,vorbis" />
                            <source src={sourceMp4} type="video/mp4" />
                        </ReactVideoPlayer>
                    </PageOverlay>
                )}

                <VideoList
                    videos={videos}
                    baseUrl={videosBaseUrl}
                    onSelected={video => {
                        this.openVideo(video);
                    }}
                />

                {selectedVideo === undefined && (
                    <div style={searchBoxStyle}>
                        <SearchBox onChange={e => this.updateSearch(e)} />
                    </div>
                )}
            </PageOverlay>
        );
    }
}

export default VideoListContainer;
