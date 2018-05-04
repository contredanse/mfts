import AppAssetsLocator from '@src/core/app-assets-locator';

export interface IBaseEntityOptions {
    fallbackLang: string;
    assetsLocator: AppAssetsLocator;
}

export class BaseEntityHelper {
    constructor(protected options: IBaseEntityOptions) {}

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
    public getLocalizedValue(obj: { [key: string]: any }, lang?: string): any | undefined {
        const { fallbackLang } = this.options;
        const langCode = lang || this.options.fallbackLang;
        if (langCode in obj) {
            return obj[langCode];
        } else if (fallbackLang in obj) {
            return obj[fallbackLang];
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
