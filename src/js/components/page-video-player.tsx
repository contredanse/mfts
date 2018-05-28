import React from 'react';
import ReactPlayer, { ReactPlayerProps, SourceProps as ReactPlayerSourceProps } from 'react-player';

import VideoEntity from '@src/models/entity/video-entity';
import VideoSourceEntity from '@src/models/entity/video-source-entity';

type PageVideoPlayerProps = {
    video: VideoEntity;
} & ReactPlayerProps;

type PageVideoPlayerState = {};

export default class PageVideoPlayer extends React.Component<PageVideoPlayerProps, PageVideoPlayerState> {
    protected playerRef: React.RefObject<ReactPlayer>;
    protected playerSources: ReactPlayerSourceProps[];

    constructor(props: PageVideoPlayerProps) {
        super(props);
        this.playerRef = React.createRef();
        this.playerSources = this.getReactPlayerSources(props.video.getSources());
    }

    protected getReactPlayerSources(videoSources: VideoSourceEntity[]): ReactPlayerSourceProps[] {
        const sources = videoSources.reduce(
            (acc, source) => {
                return [
                    ...acc,
                    {
                        src: source.getSource(),
                        type: source.getHtmlVideoTypeValue(),
                    },
                ];
            },
            [] as ReactPlayerSourceProps[]
        );
        return sources;
    }

    render() {
        const { video, ...playerProps } = this.props;
        const sources = this.playerSources;

        let config = {
            file: {
                attributes: {
                    crossOrigin: 'anonymous',
                },
            },
        };

        if (video.hasCover()) {
            const firstCover = video.getFirstCover();
            config = Object.assign(config, {
                file: {
                    attributes: {
                        poster: firstCover,
                    },
                },
            });
        }

        return <ReactPlayer ref={this.playerRef} playsinline={true} {...playerProps} url={sources} config={config} />;
    }
}
