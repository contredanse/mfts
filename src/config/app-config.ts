import {IDataMenu} from '@data/data-menu';
import {IDataVideo} from '@data/data-videos';
import {IDataPage} from '@data/data-pages';
import dataMenu from '@data/data-menu.json';
import dataVideos from '@data/data-videos.json';
import dataPages from '@data/data-pages.json';

const isProduction = true;

const assets_base_url = 'http://soluble.io/mfts/assets/';

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
        return this.config.assets_base_url;
    }

    getVideosBaseUrl(): string {
        return this.config.videos_base_url;
    }

    getAppData(): IAppDataConfig {
        return this.config.data;
    }
}

export interface IAppDataConfig {
    menu: IDataMenu;
    pages: IDataPage[];
    videos: IDataVideo[];
}

export interface IAppConfig {
    assets_base_url: string;
    videos_base_url: string;
    data: IAppDataConfig;
}

export const appConfig = new AppConfig({
    assets_base_url: assets_base_url,
    videos_base_url: assets_base_url + 'videos/',
    data: {
        menu: dataMenu,
        pages: dataPages,
        videos: dataVideos,
    },
});
