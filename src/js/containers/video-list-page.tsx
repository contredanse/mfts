import React from 'react';
import {IVideoData} from '@data/IVideoData';
//import {VideoPlayer} from "@src/components";
import VideoList from '@data/video-list.json';
interface IProps {

}
interface IState {
    videos: IVideoData[];
}

class VideoListPage extends React.Component<IProps, IState> {

    state = {
        videos: [] as IVideoData[]
    }

    constructor(props: IProps) {
        super(props);
    }

    componentDidMount() {
        this.setState(
           {
               videos: VideoList
           }
        );
    }

    render() {
        const list = this.state.videos;
        return (
            <div>
                { list && list.map(({name, sources, covers}) => {
                    /*
                    <VideoPlayer sourceUrl={sources.mp4}>

                    </VideoPlayer>
                    */
                    const coverImg = 'http://soluble.io/mfts/assets/' + (covers[1]) as string;
                    return (<img key={name} src={coverImg} width={100} title={name} />)
                })}
            </div>
        );
    }
}

export default VideoListPage;
