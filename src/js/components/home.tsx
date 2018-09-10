import React from 'react';
import { Link } from 'react-router-dom';

type HomeProps = {
    assetsUrl?: string;
};
type HomeState = {};

const LangSelector: React.SFC<any> = (props: HomeProps) => {
    const videosBaseUrl = 'https://assets.materialforthespine.com/videos';

    const videoSrcs = [
        { src: `${videosBaseUrl}/intro_2tubes_walk.webm`, type: 'video/webm' },
        { src: `${videosBaseUrl}/intro_2tubes_walk.mp4`, type: 'video/mp4' },
    ];
    return (
        <div
            className="intro-lang-selection"
            style={{
                flex: '0 1 100%',
                maxWidth: '100%',
            }}
        >
            <div
                className="video-ctn-ctn-ctn"
                style={{
                    //margin: '40px auto',
                    //outline: '1px solid #dadada',
                    width: '100%',
                }}
            >
                <video
                    style={{
                        display: 'block',
                        //border: '1px solid blue',
                        width: '100%',
                    }}
                    playsInline
                    autoPlay
                    muted
                    loop
                >
                    {videoSrcs.map((v, idx) => (
                        <source key={idx} src={v.src} type={v.type} />
                    ))}
                </video>
            </div>
            <p>
                <Link to="/en/intro">Material for the spine - a movement study</Link>
            </p>
            <p>
                <Link to="/fr/intro">Material for the spine - une étude du mouvement</Link>
            </p>
        </div>
    );
};

export default class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
    }

    render() {
        return (
            <>
                <LangSelector />
            </>
        );
    }
}
