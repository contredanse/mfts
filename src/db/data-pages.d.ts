export interface IDataPage {
    page_id: string;
    name: IDataPageLocalizedText;
    title: IDataPageLocalizedText;
    cover?: string; // jpg cover for the page
    keywords: IDataPageLocalizedKeywords;
    content: IDataPageContent;
    sort_idx: number;
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
    videos: IDataPageVideoEntity[];
    audio?: IDataPageAudio;
}

export interface IDataPageVideoEntity {
    video_id: LocalizedVideoId;
    muted?: boolean;
    loop?: boolean;
    video_detail?: IDataPageVideoDetail;
}

export interface IDataPageVideoDetail {
    video_id: LocalizedVideoId;
    desc?: {
        en: string;
        fr: string;
    };
    muted?: boolean;
    loop?: boolean;
}

export interface IDataPageAudio {
    src: LocalizedAudioSource;
    tracks?: {
        en: string;
        fr: string;
    };
}

export type LocalizedAudioSource = {
    en: string; // Only english is mandatory
    fr?: string;
};

export type LocalizedVideoId = {
    en: string; // Only english is mandatory
    fr?: string;
};
