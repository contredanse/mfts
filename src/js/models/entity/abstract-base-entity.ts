import AppAssetsLocator, { AppAssetsLocatorTypes } from '@src/core/app-assets-locator';

export interface IBaseEntityOptions {
    fallbackLang: string;
    assetsLocator: AppAssetsLocator;
}

export interface ITranslatedValue<T> {
    [key: string]: T;
}

export class BaseEntityHelper {
    constructor(protected options: IBaseEntityOptions) {}

    /**
     * Return complete url of an assets by type using
     * the AppAssetsLocator
     *
     * @param {string} filename
     * @param {AppAssetsLocatorTypes} assetType
     * @returns {string}
     */
    public getAssetUrl(filename: string, assetType: AppAssetsLocatorTypes = 'default'): string {
        return this.options.assetsLocator.getMediaAssetUrl(assetType, filename);
    }

    /**
     * Prefix value/filename with specified baseUrl or fallback
     * to options.baseUrl. If none match, filename will be returned as is.
     * Note that empty baseUrl will be considered as non-existent.
     *
     * @param {string} filename
     * @param {string} baseUrl
     * @returns {string}
     */
    public addBaseUrl(filename: string, baseUrl?: string): string {
        if (baseUrl) {
            return `${baseUrl}/${filename}`;
        }
        return this.options.assetsLocator.getMediaAssetUrl('default', filename);
    }
    /**
     * Search inside an localized value ({fr: 'file.fr.vtt', en: 'file.en.vtt')
     * for the specified lang entry. If lang is not provided, fallback to
     * options.fallbackLang.
     *
     */
    public getLocalizedValue<V>(localizedObject: ITranslatedValue<V>, lang?: string): V | undefined {
        const { fallbackLang } = this.options;
        const langCode = lang || this.options.fallbackLang;
        if (langCode in localizedObject) {
            return localizedObject[langCode];
        } else if (fallbackLang in localizedObject) {
            return localizedObject[fallbackLang];
        }
        return undefined;
    }
}

export abstract class AbstractBaseEntity {
    readonly options: IBaseEntityOptions;

    protected helper!: BaseEntityHelper;

    constructor(options: IBaseEntityOptions) {
        this.options = options;
    }

    protected getHelper(): BaseEntityHelper {
        if (this.helper === undefined) {
            this.helper = new BaseEntityHelper(this.options);
        }
        return this.helper;
    }
}
