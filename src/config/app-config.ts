import { IJsonMenu } from '@data/json/data-menu';
import { IJsonVideo } from '@data/json/data-videos';
import { IJsonPage } from '@data/json/data-pages';
import dataMenu from '@data/json/data-menu.json';
import dataVideos from '@data/json/data-videos.json';
import dataPages from '@data/json/data-pages.json';
import { DataSupportedLangType, IDataRepository, IDataRepositoryParams } from '@model/repository/data-repository';
import LocalDataRepository from '@model/repository/local-data-repository';

const isProduction = true;

// without ending slash !
const assetsBaseUrl = 'https://soluble.io/mfts/assets';

if (!isProduction) {
    // Change some params here if needed
}

export class AppConfig {
    protected config: IAppConfig;
    constructor(config: IAppConfig) {
        this.config = config;
    }

    get assetsBaseUrl(): string {
        return this.config.assetsBaseUrl;
    }

    get videosBaseUrl(): string {
        return `${this.assetsBaseUrl}/videos`;
    }

    get audioBaseUrl(): string {
        return `${this.assetsBaseUrl}`;
    }

    getConfig(): IAppConfig {
        return this.config;
    }

    /**
     * @deprecated
     */
    getAppData(): IAppDataConfig {
        return this.config.data;
    }

    getDataRepository(params?: IDataRepositoryParams): IDataRepository {
        if (params === undefined) {
            // Default params
            params = {
                fallbackLang: this.config.fallbackLang as DataSupportedLangType,
                assetsBaseUrl: `${this.assetsBaseUrl}`,
                videoBaseUrl: `${this.videosBaseUrl}`,
                audioBaseUrl: `${this.audioBaseUrl}`,
            };
        }
        return new LocalDataRepository(this.config.data, params);
    }
}

export interface IAppDataConfig {
    readonly menu: IJsonMenu;
    readonly pages: IJsonPage[];
    readonly videos: IJsonVideo[];
}

export interface IAppConfig {
    assetsBaseUrl: string;
    fallbackLang: string;
    data: IAppDataConfig;
}

export const appConfig = new AppConfig({
    assetsBaseUrl: assetsBaseUrl,
    fallbackLang: 'en',
    data: {
        menu: dataMenu,
        pages: dataPages,
        videos: dataVideos,
    },
});
