import React from 'react';
import {Link} from 'react-router-dom';
import {VideoPlayer} from '@src/components';

interface IProps {

}
interface IState {
}

export default class IntroPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    gotoMenu(): void {
        alert('end of the video -> where to go next ?');
    }

    render() {
        const videoUrl = 'http://soluble.io/mfts/assets/new_intro.mp4';
        const videoStyle = {
            display: 'block',
            margin: '0 auto',
        };
        return (
            <div style={{backgroundColor: 'black'}}>
                <div style={{position: 'fixed', top: '15px', right: '15px'}}>
                    <Link to="/menu">Close</Link>
                </div>
                <div>
                    <VideoPlayer
                        sourceUrl={videoUrl}
                        style={videoStyle}
                        autoPlay={true}
                        muted={false}
                        controls={true}
                        onEnd={() => {
                            this.gotoMenu();
                        }}
                    />
                </div>
            </div>
        );
    }
}
