export interface IBaseEntityOptions {
    lang: string;
    fallbackLang: string;
    baseUrl?: string;
    assetsBaseUrl?: {
        video: '';
        audio: '';
    };
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
        const url = baseUrl || this.options.baseUrl;
        if (url === undefined || baseUrl === '') {
            return filename;
        }
        return `${url}/${filename}`;
    }

    /**
     * Search inside an localized value ({fr: 'file.fr.vtt', en: 'file.en.vtt')
     * for the specified lang entry. If lang is not provided, fallback to
     * options.fallbackLang.
     *
     * @param {{[p: string]: any}} obj
     * @param {string} lang
     * @returns {any | undefined}
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
    readonly defaultOptions: IBaseEntityOptions = {
        lang: 'en',
        fallbackLang: 'en',
    };

    readonly options: IBaseEntityOptions;

    protected helper!: BaseEntityHelper;

    constructor(options?: IBaseEntityOptions) {
        if (options === undefined) {
            this.options = this.defaultOptions;
        } else {
            this.options = Object.assign(this.defaultOptions, options);
        }
    }

    protected getHelper(): BaseEntityHelper {
        if (this.helper === undefined) {
            this.helper = new BaseEntityHelper(this.options);
        }
        return this.helper;
    }
}
