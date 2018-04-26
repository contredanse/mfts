/**
 * @todo Refactor (for now a big test class)
 */
import { IDataPage, IDataPageAudioEntity } from '@data/data-pages';
import { IAppDataConfig } from '@config/app-config';
import { IDataVideo } from '@data/data-videos';
import { cloneDeep } from 'lodash-es';

export type SupportedLangType = 'en' | 'fr';

export interface IDataProxyParams {
    defaultLang: SupportedLangType;
    baseUrl: {
        video: string;
        audio: string;
        videoCovers: string;
    };
}

export interface IPageEntity {
    pageId: string;
    title: string;
    sortIdx: number;
    name: string;
    keywords?: string[];
    videos: IDataVideo[];
    cover?: string;
    audio?: IDataPageAudioEntity;
    audioTrack?: string;
}

export class PageEntity {
    protected readonly data: IPageEntity;

    constructor(data: IPageEntity) {
        this.data = data;
    }

    get pageId(): string {
        return this.data.pageId;
    }

    get name(): string {
        return this.data.name;
    }

    get title(): string {
        return this.data.title;
    }

    get keywords(): string[] {
        console.log('keywords', this.data.keywords);
        return this.data.keywords || [];
    }

    countVideos(): number {
        return this.data.videos.length;
    }

    getVideos(): IDataVideo[] {
        return this.data.videos;
    }

    hasAudio(): boolean {
        return this.data.audio !== undefined;
    }

    hasAudioTrack(): boolean {
        return this.data.audioTrack !== undefined;
    }

    getAudioTrack(): string | undefined {
        if (!this.hasAudioTrack()) {
            return undefined;
        }
        return this.data.audioTrack;
    }
    getAudio(): IDataPageAudioEntity | undefined {
        return this.data.audio;
    }
}

export default class DataProxy {
    public readonly props: IDataProxyParams;
    protected readonly data: IAppDataConfig;
    protected readonly fallbackLang = 'en';

    constructor(data: IAppDataConfig, props: IDataProxyParams) {
        this.props = props;
        this.data = data;
    }

    /**
     * Get raw page information
     * @param {string} pageId
     * @returns {Promise<IDataPage>}
     */
    async getPage(pageId: string): Promise<IDataPage> {
        return new Promise<IDataPage>((resolve, reject) => {
            const page = this.data.pages.find((element: IDataPage) => {
                return pageId === element.page_id;
            });
            if (page === undefined) {
                reject(`Page '${pageId}' cannot be found`);
            }
            resolve(page);
        });
    }

    async getVideo(id: string): Promise<IDataVideo> {
        return new Promise<IDataVideo>((resolve, reject) => {
            const video = cloneDeep(
                this.data.videos.find((element: IDataVideo) => {
                    return id === element.video_id;
                })
            );
            if (video === undefined) {
                reject(`Video '${id}' cannot be found`);
            }
            resolve(video);
        });
    }

    /**
     * Return localized page with medias
     *
     * @param {string} pageId
     * @param {string} lang
     * @returns {Promise<IPageEntity>}
     */
    async getPageEntity(pageId: string, lang: SupportedLangType): Promise<PageEntity> {
        const pageData = await this.getPage(pageId);

        const { content } = pageData;

        // get localized video versions
        const videos: IDataVideo[] = [];
        content.videos.forEach(async videoContent => {
            const { muted, loop, video_detail: videoDetail } = videoContent;
            const videoId = videoContent.video_id[lang] || videoContent.video_id[this.fallbackLang];
            const video = await this.getVideo(videoId);

            const { video: videoBaseUrl } = this.props.baseUrl;

            video.sources.webm = `${videoBaseUrl}${video.sources.webm}`;
            video.sources.mp4 = `${videoBaseUrl}${video.sources.mp4}`;

            if (video.covers !== undefined) {
                const covers: string[] = [];
                video.covers.forEach(cover => {
                    covers.push(`${videoBaseUrl}${cover}`);
                });
                video.covers = covers;
            }
            videos.push(video);
        });

        // get localized audio versions
        let audioSrc;
        let audioTrack;
        if (content.audio !== undefined) {
            const { audio } = content;
            audioSrc = audio.src[lang] || audio.src[this.fallbackLang];
            if (audio.tracks !== undefined) {
                audioTrack = audio.tracks[lang] || audio.tracks[this.fallbackLang];
            }
        }

        const pageEntityProps: IPageEntity = {
            pageId: pageData.page_id,
            title: pageData.title[lang],
            sortIdx: pageData.sort_idx,
            name: pageData.name[lang],
            videos: videos,
            cover: pageData.cover,
            keywords: pageData.keywords[lang] || pageData.keywords[this.fallbackLang],
            audio: pageData.content.audio,
            audioTrack: audioTrack,
        };

        //keywords: pageData.keywords[lang],
        //cover: pageData.cover,

        return new Promise<PageEntity>((resolve, reject) => {
            resolve(new PageEntity(pageEntityProps));
        });
    }
}
