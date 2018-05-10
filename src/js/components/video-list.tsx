import * as React from 'react';
import './video-list.scss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { IJsonVideo } from '@data/json/data-videos';

type VideoListProps = {
    videos: IJsonVideo[];
    baseUrl: string;
    onSelected: (video: IJsonVideo) => void;
};

type VideoListState = {};

export class VideoList extends React.Component<VideoListProps, VideoListState> {
    render() {
        const list = this.props.videos;
        const { baseUrl, onSelected } = this.props;
        const Animate = ({ children, ...props }) => (
            <CSSTransition {...props} enter={true} appear={true} exit={false} timeout={1000} classNames="fade">
                {children}
            </CSSTransition>
        );

        return (
            <div className="video-list-wrapper">
                <TransitionGroup className="grid-cards">
                    {list &&
                        list.map(video => {
                            const { video_id } = video;
                            const coverImg = `${baseUrl}/covers/${video_id}-02.jpg`;
                            return (
                                <Animate key={video_id}>
                                    <div
                                        className="card"
                                        style={{ backgroundImage: `url(${coverImg})` }}
                                        key={video_id}
                                        onClick={() => onSelected(video)}
                                    >
                                        <h2>{video_id}</h2>
                                    </div>
                                </Animate>
                            );
                        })}
                </TransitionGroup>
            </div>
        );
    }
}
