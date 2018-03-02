import React from 'react';
import {IVideoData} from '@data/video-list-data';
import VideoListData from '@data/video-list-data.json';
import {VideoList} from "@src/components/video-list";
import {PageOverlay} from "@src/components/page-overlay";
import {SearchBox} from "@src/components/search-box";
import {VideoPlayer} from "@src/components";
interface IProps {
    videoBaseUrl: string
}
interface IState {
    videos: IVideoData[];
    selectedVideo?: string;
}

class VideoListPage extends React.Component<IProps, IState> {

    initialData: IVideoData[];

    public static defaultProps = {
        videoBaseUrl: 'http://soluble.io/mfts/assets/',
    }

    constructor(props: IProps) {
        super(props);
        this.initialData = VideoListData;
        this.state = {
            videos: this.initialData,
        }
    }

    updateSearch = (e) => {
        e.preventDefault();
        const fragment = e.target.value;
        const regex = new RegExp(fragment, 'i');
        const filtered = this.initialData.filter(function(videoData) {
            const content = videoData.name;
            return (content.search(regex) > -1);
        });

        this.setState({
            videos: filtered,
        });
    }

    openVideo = (videoUrl: string) => {
        console.log('videoUrl', videoUrl);
        this.setState((state) => ({
            ...state, selectedVideo: videoUrl
        }));
    }

    closeVideo = () => {
        console.log('closing selected video');
        this.setState((state) => ({
            ...state, selectedVideo: undefined
        }));
    }

    render() {
        const { videos, selectedVideo } = this.state;
        const { videoBaseUrl } = this.props;
        const searchBoxStyle = {
            position: 'fixed',
            top: '70px',
            right: '25px',
        } as React.CSSProperties;

        console.log('rerender', selectedVideo);
        return (
            <PageOverlay>
                { selectedVideo &&
                    <PageOverlay closeButton={true} onClose={() => { this.closeVideo() }}>
                        <VideoPlayer sourceUrl={selectedVideo}
                                     onEnd={() => {this.closeVideo()}}
                                     autoPlay={true}
                                     controls={true}
                        />
                    </PageOverlay>
                }
                { (selectedVideo === undefined && videos) &&
                    <VideoList videos={videos} baseUrl={videoBaseUrl}
                               onSelected={(videoUrl) => {
                                    this.openVideo(videoUrl)
                               }}/>
                }
                { (selectedVideo === undefined) &&
                    <div style={searchBoxStyle}>
                        <SearchBox onChange={(e) => this.updateSearch(e)} />
                    </div>
                }
            </PageOverlay>
        );
    }
}

export default VideoListPage;
