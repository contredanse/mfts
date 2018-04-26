import { IDataMenu } from '@data/data-menu';
import { IDataVideo } from '@data/data-videos';
import { IDataPage } from '@data/data-pages';
import dataMenu from '@data/data-menu.json';
import dataVideos from '@data/data-videos.json';
import dataPages from '@data/data-pages.json';
import DataProxy, { IDataProxyParams } from '@src/repositories/data-proxy';

const isProduction = true;

const assetsBaseUrl = 'https://soluble.io/mfts/assets/';

if (!isProduction) {
    // Change some params here if needed
}

export class AppConfig {
    protected config: IAppConfig;
    constructor(config: IAppConfig) {
        this.config = config;
    }

    getConfig(): IAppConfig {
        return this.config;
    }

    getAssetsBaseUrl(): string {
        return this.config.assetsBaseUrl;
    }

    getVideosBaseUrl(): string {
        return this.config.videosBaseUrl;
    }

    getAppData(): IAppDataConfig {
        return this.config.data;
    }

    getDataProxy(params?: IDataProxyParams): DataProxy {
        if (params === undefined) {
            params = {
                defaultLang: 'en',
                baseUrl: {
                    video: this.getVideosBaseUrl(),
                    videoCovers: this.getVideosBaseUrl(),
                    audio: this.getVideosBaseUrl(),
                },
            };
        }
        return new DataProxy(this.config.data, params);
    }
}

export interface IAppDataConfig {
    readonly menu: IDataMenu;
    readonly pages: IDataPage[];
    readonly videos: IDataVideo[];
}

export interface IAppConfig {
    assetsBaseUrl: string;
    videosBaseUrl: string;
    data: IAppDataConfig;
}

export const appConfig = new AppConfig({
    assetsBaseUrl: assetsBaseUrl,
    videosBaseUrl: assetsBaseUrl + 'videos/',
    data: {
        menu: dataMenu,
        pages: dataPages,
        videos: dataVideos,
    },
});
