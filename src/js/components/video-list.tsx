import * as React from 'react';
import './video-list.scss';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {IDataVideo} from "@data/data-videos";

interface IProps {
    videos: IDataVideo[];
    baseUrl: string;
    onSelected: (video: IDataVideo) => void;
}

interface IState {
}

export class VideoList extends React.Component<IProps, IState> {
    render() {
        const list = this.props.videos;
        const {baseUrl, onSelected} = this.props;
        const Fade = ({ children, ...props }) => (
            <CSSTransition
                {...props}
                exit={false}
                enter={false}
                appear={false}
                timeout={200}
                classNames="fade"
            >
                {children}
            </CSSTransition>
        );

        return (
                <TransitionGroup className="video-list-ctn">
                { list && list.map((video) => {
                    const {video_id} = video;
                    const coverImg = baseUrl + 'covers/' + video_id + '-02.jpg';
                    return (
                        <Fade key={video_id}>
                            <div className="video-card-ctn" key={name} onClick={() => onSelected(video)} >
                                <img className="video-cover-img" src={coverImg} title={video_id} />
                            </div>
                        </Fade>
                    );
                })}
                </TransitionGroup>
        );
    }
}
