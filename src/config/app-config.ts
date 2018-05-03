import { IDataMenu } from '@db/data-menu';
import { IJsonVideo } from '@db/data-videos';
import { IDataPage } from '@db/data-pages';
import dataMenu from '@db/data-menu.json';
import dataVideos from '@db/data-videos.json';
import dataPages from '@db/data-pages.json';
import { IDataRepository, IDataRepositoryParams } from '@src/data/data-repository';
import LocalDataRepository from '@src/data/local-data-repository';

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

    getDataRepository(params?: IDataRepositoryParams): IDataRepository {
        if (params === undefined) {
            params = {
                defaultLang: 'en',
                assetsBaseUrl: assetsBaseUrl,
                urlPaths: {
                    video: this.getVideosBaseUrl(),
                    videoCovers: this.getVideosBaseUrl(),
                    audio: this.getVideosBaseUrl(),
                },
            };
        }
        return new LocalDataRepository(this.config.data, params);
    }
}

export interface IAppDataConfig {
    readonly menu: IDataMenu;
    readonly pages: IDataPage[];
    readonly videos: IJsonVideo[];
}

export interface IAppConfig {
    assetsBaseUrl: string;
    videosBaseUrl: string;
    data: IAppDataConfig;
}

export const appConfig = new AppConfig({
    assetsBaseUrl: assetsBaseUrl,
    // without ending slash
    videosBaseUrl: `${assetsBaseUrl}/videos`,
    data: {
        menu: dataMenu,
        pages: dataPages,
        videos: dataVideos,
    },
});
