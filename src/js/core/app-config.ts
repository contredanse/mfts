import { DataSupportedLangType, IDataRepository, IDataRepositoryParams } from '@src/models/repository/data-repository';
import LocalDataRepository from '@src/models/repository/local-data-repository';
import { IJsonPage } from '@data/json/data-pages';
import { IJsonVideo } from '@data/json/data-videos';
import { IJsonMenu } from '@data/json/data-menu';
import AppAssetsLocator, { IAssetsLocatorProps } from '@src/core/app-assets-locator';

export default class AppConfig {
    protected _assetsLocator!: AppAssetsLocator;

    constructor(protected readonly config: IAppConfig) {}

    get fallbackLang(): string {
        return this.config.fallbackLang;
    }

    get assetsLocator(): AppAssetsLocator {
        if (!this._assetsLocator) {
            this._assetsLocator = new AppAssetsLocator(this.config.assetsLocatorProps);
        }
        return this._assetsLocator;
    }

    getDataRepository(params?: IDataRepositoryParams): IDataRepository {
        if (params === undefined) {
            // Default params
            params = {
                fallbackLang: this.config.fallbackLang as DataSupportedLangType,
                assetsBaseUrl: this.assetsLocator.getMediaTypeBaseUrl('default'),
                videoBaseUrl: this.assetsLocator.getMediaTypeBaseUrl('videos'),
                audioBaseUrl: this.assetsLocator.getMediaTypeBaseUrl('audios'),
            };
        }
        return new LocalDataRepository(this);
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

export interface IAppConfig {
    assetsLocatorProps: IAssetsLocatorProps;
    fallbackLang: string;
    data: IAppDataConfig;
}

export interface IAppDataConfig {
    readonly menu: IJsonMenu;
    readonly pages: IJsonPage[];
    readonly videos: IJsonVideo[];
}
