import React from 'react';
import {VideoList} from '@src/components/video-list';
import {PageOverlay} from '@src/components/page-overlay';
import {SearchBox} from '@src/components/search-box';
import {ReactVideoPlayer} from '@src/components/react-video-player';
import {IDataVideo} from '@data/data-videos';

interface IProps {
    initialData: IDataVideo[];
    videosBaseUrl: string;
}

interface IState {
    videos: IDataVideo[];
    selectedVideo?: IDataVideo;
    searchFragment?: string;
}

class VideoListPage extends React.Component<IProps, IState> {

    public static defaultProps = {

    };

    constructor(props: IProps) {
        super(props);
        this.state = {
            videos: this.props.initialData,
        };
    }

    updateSearch = (e) => {
        e.preventDefault();
        const fragment = e.target.value;
        const regex = new RegExp(fragment, 'i');
        const filtered = this.props.initialData.filter(function(videoData) {
            const content = videoData.video_id;
            return (content.search(regex) > -1);
        });

        this.setState({
            videos: filtered,
            searchFragment: fragment,
        });
    }

    openVideo = (video: IDataVideo) => {
        this.setState((state) => ({
            ...state,
            selectedVideo: video,
        }));
    }

    closeVideo = () => {
        console.log('closing selected video');
        this.setState((state) => ({
            ...state, selectedVideo: undefined,
        }));
    }

    render() {
        const { videos, selectedVideo } = this.state;
        const { videosBaseUrl } = this.props;
        const searchBoxStyle = {
            position: 'fixed',
            top: '70px',
            right: '25px',
            width: '150px',
        } as React.CSSProperties;

        let source_mp4, source_webm, poster = '';
        if (selectedVideo !== undefined) {
            poster = this.props.videosBaseUrl + selectedVideo.video_id + '.jpg';
            source_mp4 = this.props.videosBaseUrl + selectedVideo.sources.mp4;
            source_webm = this.props.videosBaseUrl + selectedVideo.sources.webm;
        }

        return (
            <PageOverlay>
                { selectedVideo &&
                    <PageOverlay closeButton={true} onClose={() => { this.closeVideo(); }}>
                        <ReactVideoPlayer
                                     poster={poster}
                                     onEnd={() => {this.closeVideo(); }}
                                     autoPlay={true}
                                     controls={true}
                        >
                            <source src={source_webm} type="video/webm; codecs=vp9,vorbis" />
                            <source src={source_mp4} type="video/mp4" />
                        </ReactVideoPlayer>
                    </PageOverlay>

                }

                <VideoList videos={videos} baseUrl={videosBaseUrl}
                           onSelected={(video) => {
                                this.openVideo(video);
                           }}/>

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
