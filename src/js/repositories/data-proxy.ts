import { IDataPage } from '@data/data-pages';
import { IAppDataConfig } from '@config/app-config';
import { IDataVideo } from '@data/data-videos';

export interface IParams {
    defaultLang: 'en' | 'fr';
}

export default class DataProxy {
    protected readonly defaultParams: IParams;
    protected readonly data: IAppDataConfig;

    constructor(data: IAppDataConfig, defaultParams: IParams) {
        this.defaultParams = defaultParams;
        this.data = data;
    }

    public getDefaultParams(): IParams {
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

    async getPageElements(pageId: string, lang: string): Promise<IDataPage> {
        const pageData = await this.getPage(pageId);
        const { videos } = pageData.content;

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
