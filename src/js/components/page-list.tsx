import React from 'react';
import './page-list.scss';
import { IJsonPage, IJsonPageVideo } from '@data/json/data-pages';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { IJsonVideo } from '@data/json/data-videos';
import dataVideos from '@data/json/data-videos.json';
import { ReactNode } from 'react';

type PageListProps = {
    pages: IJsonPage[];
    lang: string;
    baseUrl: string;
    onSelected?: (page: IJsonPage) => void;
};

type PageListState = {};

export default class PageList extends React.Component<PageListProps, PageListState> {
    handlePageSelection(page: IJsonPage) {
        if (this.props.onSelected !== undefined) {
            this.props.onSelected(page);
        }
    }

    render() {
        const { pages: list, lang } = this.props;

        const Animate = ({ children, ...props }: { children: ReactNode }) => (
            <CSSTransition {...props} enter={true} appear={true} exit={false} timeout={1000} classNames="fade">
                {children}
            </CSSTransition>
        );

        const toc = this.getTocComponent(list);
        const baseUrl = this.props.baseUrl;
        return (
            <div>
                <div className="page-list-wrapper">
                    <TransitionGroup className="grid-cards">
                        {list &&
                            list.map(page => {
                                const { page_id: pageId, content } = page;
                                const title = page.title[lang];
                                const fallbackLang = 'en';

                                let videos: IJsonVideo[] = [];
                                switch (content.layout) {
                                    case 'single-video':
                                    case 'single-video-audio':
                                    case 'single-video-audio_i18n':
                                    case 'single-i18n-video': {
                                        const langVideoId = content.videos[0].lang_video_id;
                                        videos.push(this.getVideo(langVideoId[lang] || langVideoId[fallbackLang]));
                                        /*
                                        const video_id = (content.videos as IDataPageVideoEntity[])[0][
                                            'versions'
                                        ][lang].video_id;
                                        videos[0] = this.getVideo(video_id);
                                        */
                                        break;
                                    }
                                    case 'two-videos-only':
                                    case 'two-videos-audio-subs':
                                    case 'three-videos-only':
                                    case 'three-videos-audio-subs': {
                                        videos = (content.videos as IJsonPageVideo[]).map(({ lang_video_id }) => {
                                            return this.getVideo(lang_video_id[lang] || lang_video_id[fallbackLang]);
                                        });
                                        break;
                                    }
                                    default:
                                        alert(`error${content.layout}${pageId}`);
                                }

                                // TODO fix the idea of pageCover !!!
                                //const coverImg = `${urlPaths}covers/${page.cover}`;

                                const firstVideoId = videos[0].video_id;
                                const coverImg = `${baseUrl}/covers/${firstVideoId}-03.jpg`;

                                const cardBackgroundStyle = {
                                    backgroundImage: `url(${coverImg})`,
                                };

                                return (
                                    <Animate key={pageId}>
                                        <div
                                            className="card"
                                            style={cardBackgroundStyle}
                                            key={pageId}
                                            onClick={() => this.handlePageSelection(page)}
                                        >
                                            <span className="page-title">{title}</span>

                                            {videos.length > 1 && (
                                                <div className="grid-page-thumbnail">
                                                    {videos.map((video, idx) => {
                                                        const videoCover = `${baseUrl}/covers/${video.video_id}-01.jpg`;
                                                        const separator = idx % 4 === 0 ? <div>AAAAAA</div> : '';
                                                        return (
                                                            <React.Fragment key={video.video_id}>
                                                                {separator}
                                                                <div>
                                                                    <img src={videoCover} title={video.video_id} />
                                                                </div>
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </Animate>
                                );
                            })}
                    </TransitionGroup>
                </div>

                <div>
                    <h2>Table of contents</h2>
                    {toc}
                </div>
            </div>
        );
    }

    protected getTocComponent(list: IJsonPage[]): JSX.Element {
        return (
            <table>
                <thead>
                    <tr>
                        <td />
                        <td>Title</td>
                        <td>Layout</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map((page: IJsonPage, idx: number) => (
                        <tr key={page.page_id}>
                            <td>{idx + 1}</td>
                            <td
                                onClick={() => {
                                    this.handlePageSelection(page);
                                }}
                            >
                                {page.title[this.props.lang]}
                            </td>
                            <td>{page.content.layout}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    protected getVideo(videoId: string): IJsonVideo {
        return dataVideos.filter((video: IJsonVideo) => {
            return video.video_id === videoId;
        })[0];
    }
}
