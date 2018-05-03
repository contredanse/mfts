export interface IJsonPage {
    page_id: string;
    name: IJsonPageLocalizedText;
    title: IJsonPageLocalizedText;
    cover?: string; // jpg cover for the page
    keywords: IJsonPageLocalizedKeywords;
    content: IJsonPageContent;
    sort_idx: number;
}

export interface IJsonPageLocalizedText {
    en: string;
    fr: string;
    [key: string]: string; // subsequent languages
}

export interface IJsonPageLocalizedKeywords {
    [key: string]: string[]; // optional languages codes (en, fr, ...)
}

export interface IJsonPageContent {
    layout: string;
    videos: IJsonPageVideo[];
    audio?: IJsonPageAudio;
}

export interface IJsonPageVideo {
    video_id: IJsonLocalizedVideoId;
    muted?: boolean;
    loop?: boolean;
    video_detail?: IJsonPageVideoDetail;
}

export interface IJsonPageVideoDetail {
    video_id: IJsonLocalizedVideoId;
    desc?: {
        en: string;
        fr: string;
    };
    muted?: boolean;
    loop?: boolean;
}

export interface IJsonPageAudioTrack {
    lang: string;
    src: string;
}

export interface IJsonPageAudio {
    src: IJsonLocalizedAudioSource;
    tracks?: IJsonPageAudioTrack[];
}

export type IJsonLocalizedAudioSource = {
    en: string; // Only english is mandatory
    [key: string]: string; // subsequent languages
};

export type IJsonLocalizedVideoId = {
    en: string; // Only english is mandatory
    [key: string]: string; // subsequent languages
};
