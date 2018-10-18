import React, { SyntheticEvent } from 'react';
import './page-card.scss';
import PageProxy from '@src/models/proxy/page-proxy';

type PageCardProps = {
    pageProxy: PageProxy;
    lang?: string;
    onClick?: (pageId: string) => void;
};

type PageCardState = {};

const defaultProps = {
    lang: 'en',
};

class PageCard extends React.PureComponent<PageCardProps, PageCardState> {
    static defaultProps = defaultProps;

    constructor(props: PageCardProps) {
        super(props);
    }

    handleClick = (e: SyntheticEvent<HTMLElement>) => {
        if (this.props.onClick) {
            this.props.onClick(this.props.pageProxy.pageId);
        }
    };

    render() {
        const { pageProxy, lang } = this.props;

        const pageId = pageProxy.pageId;

        const firstVideo = pageProxy.getFirstVideo();
        const cardBackgroundStyle = {
            ...(firstVideo ? { backgroundImage: `url(${firstVideo.getNumberedCover(3)})` } : {}),
        };

        const videos = pageProxy.getVideos(lang);

        return (
            <div className="card" style={cardBackgroundStyle} key={pageId} onClick={this.handleClick}>
                <span className="page-title">{pageProxy.getTitle(lang)}</span>
                {videos.length > 1 && (
                    <div className="grid-page-thumbnail">
                        {videos.map(video => {
                            return (
                                <React.Fragment key={video.videoId}>
                                    <div>
                                        <img src={video.getNumberedCover(2)} title={video.videoId} />
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
}

export default PageCard;
