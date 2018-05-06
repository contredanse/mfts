import * as React from 'react';
import './page-list.scss';
import { IJsonPage, IJsonPageVideo } from '@data/json/data-pages';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { IJsonVideo } from '@data/json/data-videos';
import dataVideos from '@data/json/data-videos.json';

interface IProps {
    pages: IJsonPage[];
    lang: 'en' | 'fr';
    baseUrl: string;
    onSelected?: (page: IJsonPage) => void;
}

interface IState {}

export default class PageList extends React.Component<IProps, IState> {
    handlePageSelection(page: IJsonPage) {
        console.log('pageSelected', page);
        if (this.props.onSelected !== undefined) {
            this.props.onSelected(page);
        }
    }

    render() {
        const list = this.props.pages;
        //const {urlPaths, onSelected} = this.props;

        //console.log('pages', list);

        const Animate = ({ children, ...props }) => (
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
                                const { lang } = this.props;
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

                                return (
                                    <Animate key={pageId}>
                                        <div
                                            className="card"
                                            style={{ backgroundImage: `url(${coverImg})` }}
                                            key={pageId}
                                            onClick={() => this.handlePageSelection(page)}
                                        >
                                            <h2>{pageId}</h2>
                                            <div className="grid-page-thumbnail">
                                                {videos.map(video => {
                                                    const videoCover = `${baseUrl}/covers/${video.video_id}-01.jpg`;
                                                    return (
                                                        <div key={video.video_id}>
                                                            <img src={videoCover} title={video.video_id} />
                                                            <p>{video.meta.duration}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
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
