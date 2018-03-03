import React from 'react';
import {Link} from 'react-router-dom';
//import {VideoPlayer} from '@src/components';
import {PageOverlay} from "@src/components/page-overlay";
import {ReactVideoPlayer} from "@src/components/react-video-player";

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

    closeIntro(): void {

    }

    render() {
        const videoUrl = 'http://soluble.io/mfts/assets/new_intro.mp4';
        const videoStyle = {
            display: 'block',
            margin: '0 auto',
        };
        return (
            <PageOverlay closeButton={true} onClose={() => { this.closeIntro(); }}>
                <div style={{position: 'fixed', bottom: '15px', right: '15px'}}>
                    <Link to="/menu">Skip &gt;&gt;</Link>
                </div>
                <div>
                    <ReactVideoPlayer
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
            </PageOverlay>
        );
    }
}
