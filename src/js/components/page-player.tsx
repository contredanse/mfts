import * as React from 'react';
import VideoEntity from '@src/model/entity/video-entity';
import MediaPlayer from '@src/components/player/media-player';

type HTMLVideoProps = React.VideoHTMLAttributes<HTMLVideoElement>;

export type PagePlayerProps = {
    video: VideoEntity;
    onEnd?: () => {};
} & HTMLVideoProps;

export class PagePlayer extends React.Component<PagePlayerProps, {}> {
    static defaultProps: Partial<PagePlayerProps> = {
        autoPlay: true,
        loop: false,
    };

    constructor(props: PagePlayerProps) {
        super(props);
    }

    render() {
        const { video, autoPlay, loop } = this.props;
        const muted = true;
        const controls = true;

        return (
            <div className="videocomp-container">
                <MediaPlayer
                    muted={muted}
                    loop={loop}
                    controls={controls}
                    autoPlay={autoPlay}
                    webkit-playsinline="webkit-playsinline"
                >
                    {video.getSources().map((sourceEntity, idx) => {
                        return (
                            <source
                                key={idx}
                                src={sourceEntity.getSource()}
                                type={sourceEntity.getHtmlVideoTypeValue()}
                            />
                        );
                    })}
                </MediaPlayer>
            </div>
        );
    }
}
