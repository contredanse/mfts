import * as React from 'react';
import {IVideoData} from '@data/video-list-data';
import './video-list.scss';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

interface IProps {
    videos: IVideoData[];
    baseUrl: string;
    onSelected: (videoUrl: string) => void;
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
                { list && list.map(({name, sources, covers}) => {
                    const coverImg = baseUrl + (covers[1]) as string;
                    const videoUrl = baseUrl + sources.mp4;
                    return (
                        <Fade key={name}>
                            <div className="video-card-ctn" key={name} onClick={() => onSelected(videoUrl)} >
                                <img className="video-cover-img" src={coverImg} title={name} />
                            </div>
                        </Fade>
                    );
                })}
                </TransitionGroup>
        );
    }
}
