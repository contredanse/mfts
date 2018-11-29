import React from 'react';
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

type PanelMultiVideoState = {
    isVideoDetailOpen: boolean;
    videoDetail?: VideoProxy;
};

const defaultProps = {
    playing: true,
    playbackRate: 1,
};

const defaultState = {
    isVideoDetailOpen: false,
};

type VideoDetailProps = {
    videoDetail: VideoProxy;
    isOpen: boolean;
    handleClose: () => void;
    playbackRate?: number;
    playing?: boolean;
};

const VideoDetail = (props: VideoDetailProps) => {
    return (
        <div
            className="video-detail"
            key={`detail-${props.videoDetail.videoId}`}
            onClick={() => {
                if (props.isOpen) {
                    props.handleClose();
                }
            }}
        >
            <VideoProxyPlayer
                crossOrigin={'anonymous'}
                disableSubtitles={true}
                videoProxy={props.videoDetail}
                style={{
                    width: 'auto',
                    height: '100%',
                }}
                // To prevent blinking
                disablePoster={true}
                playing={props.playing}
                playbackRate={props.playbackRate}
                onEnded={() => {
                    props.handleClose();
                }}
                muted
            />
        </div>
    );
};

export default class PanelMultiVideo extends React.Component<PanelMultiVideoProps, PanelMultiVideoState> {
    static defaultProps = defaultProps;

    constructor(props: PanelMultiVideoProps) {
        super(props);
        this.state = defaultState;
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

        const state = this.state;

        return (
            <div className="panel-multi-video-container">
                <div className="panel-multi-video" key={pageProxy.pageId}>
                    {videos.map((video, idx) => {
                        const videoIdx = `video-${idx}`;
                        let className = 'autoscale-video-container video-slided-out';
                        let videoClassName = 'autoscale-video-wrapper autoscale-video-content';
                        if (video.hasVideoLink()) {
                            videoClassName += ' clickable-video';
                        }

                        const isPlaying = this.state.isVideoDetailOpen ? false : playing;

                        if (this.state.isVideoDetailOpen) {
                            className += ' hidden';
                        }

                        return (
                            <div
                                key={`${video.videoId}`}
                                className={className}
                                onClick={() => {
                                    this.openVideoLink(video);
                                }}
                            >
                                <VideoProxyPlayer
                                    crossOrigin={'anonymous'}
                                    className={videoClassName}
                                    disableSubtitles={true}
                                    videoProxy={video}
                                    // To prevent blinking
                                    disablePoster={true}
                                    playing={isPlaying}
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

                {state.isVideoDetailOpen && state.videoDetail && (
                    <VideoDetail
                        videoDetail={state.videoDetail}
                        isOpen={state.isVideoDetailOpen}
                        handleClose={this.handleCloseModal}
                        playbackRate={playbackRate}
                        playing={playing}
                    />
                )}
            </div>
        );
    }

    protected handleCloseModal = (): void => {
        this.setState({
            isVideoDetailOpen: false,
            videoDetail: undefined,
        });
    };

    protected openVideoLink = (video: VideoProxy): void => {
        const { videoLink } = video;

        if (videoLink) {
            this.setState({
                isVideoDetailOpen: true,
                videoDetail: videoLink,
            });

            //alert(`linkedVideo ${videoLink.videoId}`);
            //console.log('linkedVideo', videoLink);
        }
    };
}
