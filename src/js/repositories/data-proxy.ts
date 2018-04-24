import { IDataPage, IDataPageVideoEntity } from '@data/data-pages';
import { IAppDataConfig } from '@config/app-config';
import { IDataVideo } from '@data/data-videos';

export type SupportedLangType = 'en' | 'fr';

export interface IDataProxyParams {
    defaultLang: SupportedLangType;
}

export interface IPageEntity {}

export default class DataProxy {
    protected readonly defaultParams: IDataProxyParams;
    protected readonly data: IAppDataConfig;
    protected readonly fallbackLang = 'en';

    constructor(data: IAppDataConfig, defaultParams: IDataProxyParams) {
        this.defaultParams = defaultParams;
        this.data = data;
    }

    public getDefaultParams(): IDataProxyParams {
        return this.defaultParams;
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
            const video = this.data.videos.find((element: IDataVideo) => {
                return id === element.video_id;
            });
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
    async getPageEntity(pageId: string, lang: SupportedLangType): Promise<IPageEntity> {
        const pageData = await this.getPage(pageId);

        const localizedPage = {
            pageId: pageData.page_id,
            title: pageData.title[lang],
            name: pageData.name[lang],
            keywords: pageData.keywords[lang],
            cover: pageData.cover,
        };

        const { content } = pageData;

        // get localized video versions
        const videos: string[] = [];
        content.videos.forEach(video => {
            videos.push(video.video_id[lang] || video.video_id[this.fallbackLang]);
        });
        //const localizedVideos = this.normalizeVideoContent(content.videos, lang);

        //const { videos } = pageData.content;

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
}
