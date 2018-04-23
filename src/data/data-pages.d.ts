export interface IDataPage {
    page_id: string;
    name: IDataPageLocalizedText;
    title: IDataPageLocalizedText;
    cover?: string; // jpg cover for the page
    keywords: IDataPageLocalizedKeywords;
    content: IDataPageContent;
}

export interface IDataPageLocalizedText {
    en: string;
    fr: string;
}

export interface IDataPageLocalizedKeywords {
    en?: (string)[];
    fr?: (string)[];
}

export interface IDataPageContent {
    layout: string;
    videos: (IDataPageVideoEntity | IDataPageLocalizedVideoEntity)[];
    audio?: IDataPageAudioEntity;
}

export interface IDataPageVideoEntity {
    video_id: string;
    muted?: boolean;
    loop?: boolean;
    video_detail?: IDataPageVideoDetail;
}

export interface IDataPageVideoDetail {
    title?: {
        en: string;
        fr: string;
    };
    video: IDataPageVideoEntity;
}

export interface IDataPageLocalizedVideoEntity {
    i18n: true;
    versions: {
        en: IDataPageVideoEntity;
        fr: IDataPageVideoEntity;
    };
}

export interface IDataPageAudioEntity {
    src: string | IDataPageLocalizedAudioSource;
    tracks?: {
        en: string;
        fr: string;
    };
}

export type IDataPageLocalizedAudioSource = {
    i18n: boolean;
    versions: {
        en: string;
        fr: string;
    };
};
