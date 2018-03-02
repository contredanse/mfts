import * as React from 'react';
import {IVideoData} from "@data/video-list-data";
import "./video-list.scss";

interface IProps {
    videos: IVideoData[];
    baseUrl: string;
    onSelected: (videoUrl: string) => void
}

interface IState {
}

export class VideoList extends React.Component<IProps, IState> {
    render() {
        const list = this.props.videos;
        const {baseUrl, onSelected} = this.props;
        return (
            <div className="video-list-ctn">
                { list && list.map(({name, sources, covers}) => {
                    const coverImg = baseUrl + (covers[1]) as string;
                    const videoUrl = baseUrl + sources.mp4;
                    return (
                        <div className="video-card-ctn" key={name} onClick={() => onSelected(videoUrl)} >
                            <p>
                                Hello {name}
                            </p>
                            <div>
                                <img className="video-cover-img" src={coverImg} title={name} />
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
