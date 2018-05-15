import React from 'react';
import { Link } from 'react-router-dom';
import { PageOverlay } from '@src/components/page-overlay';
import ReactPlayer from 'react-player';

type IntroContainerProps = {};
type IntroContainerState = {};

export default class IntroContainer extends React.Component<IntroContainerProps, IntroContainerState> {
    constructor(props: IntroContainerProps) {
        super(props);
    }

    gotoMenu(): void {
        alert('end of the video -> where to go next ?');
    }

    closeIntro(): void {
        alert('todo');
    }

    render() {
        const videoUrl = 'https://soluble.io/mfts/assets/new_intro.mp4';
        const videoStyle = {
            display: 'block',
            margin: '0 auto',
        };
        return (
            <PageOverlay
                closeButton={true}
                onClose={() => {
                    this.closeIntro();
                }}
            >
                <div style={{ position: 'fixed', bottom: '15px', right: '15px' }}>
                    <Link to="/menu">Skip &gt;&gt;</Link>
                </div>
                <div>
                    <ReactPlayer
                        url={videoUrl}
                        style={videoStyle}
                        playing={true}
                        playsinline={true}
                        muted={false}
                        controls={true}
                        onEnded={() => {
                            this.gotoMenu();
                        }}
                    />
                </div>
            </PageOverlay>
        );
    }
}
