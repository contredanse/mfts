import { DataSupportedLangType, IDataRepositoryParams } from '@src/models/repository/data-repository';
import { IJsonPage } from '@data/json/data-pages';
import { IJsonVideo } from '@data/json/data-videos';
import { IJsonMenu } from '@data/json/data-menu';
import AppAssetsLocator, { IAssetsLocatorProps } from '@src/core/app-assets-locator';
import VideoRepository from '@src/models/repository/video-repository';
import PageRepository from '@src/models/repository/page-repository';
import MenuRepository from '@src/models/repository/menu-repository';

export type ExternalUrls = {
    resetPassword: string;
    shopLink: string;
    myAccount: string;
};

export default class AppConfig {
    protected _assetsLocator!: AppAssetsLocator;

    protected readonly config: IAppConfig;

    constructor(config: IAppConfig) {
        this.config = config;
    }

    get fallbackLang(): string {
        return this.config.fallbackLang;
    }

    get assetsLocator(): AppAssetsLocator {
        if (!this._assetsLocator) {
            this._assetsLocator = new AppAssetsLocator(this.config.assetsLocatorProps);
        }
        return this._assetsLocator;
    }

    public getVideoRepository(params?: IDataRepositoryParams): VideoRepository {
        if (params === undefined) {
            // Default params
            params = {
                fallbackLang: this.config.fallbackLang as DataSupportedLangType,
                assetsBaseUrl: this.assetsLocator.getMediaTypeBaseUrl('default'),
                videoBaseUrl: this.assetsLocator.getMediaTypeBaseUrl('videos'),
                audioBaseUrl: this.assetsLocator.getMediaTypeBaseUrl('audios'),
            };
        }
        return new VideoRepository(this, this.getAppData().videos);
    }

    public getMenuRepository(params?: IDataRepositoryParams, pageRepository?: PageRepository): MenuRepository {
        if (params === undefined) {
            // Default params
            params = {
                fallbackLang: this.config.fallbackLang as DataSupportedLangType,
                assetsBaseUrl: this.assetsLocator.getMediaTypeBaseUrl('default'),
                videoBaseUrl: this.assetsLocator.getMediaTypeBaseUrl('videos'),
                audioBaseUrl: this.assetsLocator.getMediaTypeBaseUrl('audios'),
            };
        }
        return new MenuRepository(this, this.getAppData().menu, pageRepository);
    }

    public getPageRepository(params?: IDataRepositoryParams): PageRepository {
        if (params === undefined) {
            // Default params
            params = {
                fallbackLang: this.config.fallbackLang as DataSupportedLangType,
                assetsBaseUrl: this.assetsLocator.getMediaTypeBaseUrl('default'),
                videoBaseUrl: this.assetsLocator.getMediaTypeBaseUrl('videos'),
                audioBaseUrl: this.assetsLocator.getMediaTypeBaseUrl('audios'),
            };
        }
        return new PageRepository(this, this.getAppData().pages, this.getVideoRepository(params));
    }

    getExternalUrls(): ExternalUrls {
        return this.config.externalUrls;
    }

    getApiBaseUrl(): string {
        return this.config.apiBaseUrl;
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
}

export interface IAppDataConfig {
    readonly menu: IJsonMenu[];
    readonly pages: IJsonPage[];
    readonly videos: IJsonVideo[];
}

export interface IAppConfig {
    assetsLocatorProps: IAssetsLocatorProps;
    fallbackLang: string;
    data: IAppDataConfig;
    apiBaseUrl: string;
    externalUrls: ExternalUrls;
}
