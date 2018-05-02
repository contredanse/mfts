export interface IBaseEntityOptions {
    lang: string;
    fallbackLang: string;
    baseUrl: string;
}

export abstract class BaseEntity {
    readonly defaultOptions: IBaseEntityOptions = {
        lang: 'en',
        fallbackLang: 'en',
        baseUrl: '',
    };

    readonly options: IBaseEntityOptions;

    constructor(options?: IBaseEntityOptions) {
        this.options = Object.assign(this.defaultOptions, options);
    }
}
