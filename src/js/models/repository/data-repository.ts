export type DataSupportedLangType = 'en' | 'fr'; // | 'nl' | 'de' | 'es';

export interface IDataRepositoryParams {
    fallbackLang: DataSupportedLangType;
    assetsBaseUrl: string;
    videoBaseUrl: string;
    audioBaseUrl: string;
}
