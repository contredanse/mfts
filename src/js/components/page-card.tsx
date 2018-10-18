import React, { SyntheticEvent } from 'react';
import './page-card.scss';
import PageProxy from '@src/models/proxy/page-proxy';
import classNames from 'classnames';
import { formatSecondsToHuman } from '@src/components/player/utils/formatters';

type PageCardProps = {
    pageProxy: PageProxy;
    lang?: string;
    className?: string;
    extraClasses?: string;
    onClick?: (pageId: string) => void;
};

type PageCardState = {};

const defaultProps = {
    lang: 'en',
    className: 'page-card-container',
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
        const { pageProxy, lang, className, extraClasses } = this.props;

        const pageId = pageProxy.pageId;

        const firstVideo = pageProxy.getFirstVideo();
        const cardBackgroundStyle = {
            ...(firstVideo ? { backgroundImage: `url(${firstVideo.getNumberedCover(3)})` } : {}),
        };

        const videos = pageProxy.getVideos(lang);
        const duration = pageProxy.getDuration(lang);
        return (
            <div
                key={pageId}
                className={classNames(className, extraClasses)}
                style={cardBackgroundStyle}
                onClick={this.handleClick}
            >
                {videos.length > 1 && (
                    <div className="page-card-thumbnails-overlay">
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
                <div className="page-card-description-overlay">
                    <div className="page-title">{pageProxy.getTitle(lang)}</div>
                    {duration && <div className="page-duration">{formatSecondsToHuman(duration)}</div>}
                </div>
            </div>
        );
    }
}

export default PageCard;
