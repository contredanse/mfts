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
    private _assetsLocator!: AppAssetsLocator;

    private readonly config: IAppConfig;

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

    public getVideoRepository(): VideoRepository {
        return new VideoRepository(this, this.config.data.videos);
    }

    public getMenuRepository(pageRepository?: PageRepository): MenuRepository {
        return new MenuRepository(this, this.config.data.menu, pageRepository);
    }

    public getPageRepository(): PageRepository {
        return new PageRepository(this, this.config.data.pages, this.getVideoRepository());
    }

    public getExternalUrls(addLanguage?: string): ExternalUrls {
        if (addLanguage !== undefined) {
            return {
                shopLink: `${this.config.externalUrls.shopLink}&language=${addLanguage}`,
                resetPassword: `${this.config.externalUrls.resetPassword}&language=${addLanguage}`,
                myAccount: `${this.config.externalUrls.myAccount}&language=${addLanguage}`,
            };
        }
        return this.config.externalUrls;
    }

    public getApiBaseUrl(): string {
        return this.config.apiBaseUrl;
    }

    public getConfig(): IAppConfig {
        return this.config;
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
