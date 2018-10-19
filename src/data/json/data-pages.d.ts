import { ITranslatedValue } from '@src/models/proxy/abstract-base-proxy';

export interface IJsonPage {
    page_id: string;
    title: IJsonPageLocalizedText;
    cover?: string; // jpg cover for the page
    keywords: IJsonPageLocalizedKeywords;
    content: IJsonPageContent;
    sort_idx: number;
    loop?: boolean;
    loop_number?: number;
}

export interface IJsonPageLocalizedText extends ITranslatedValue<string> {
    en: string;
    fr: string;
}

export interface IJsonPageLocalizedKeywords extends ITranslatedValue<string[]> {
    // [key: string]: string[]; // optional languages codes (en, fr, ...)
}

export interface IJsonPageContent {
    layout?: string;
    videos: IJsonPageVideo[];
    audio?: IJsonPageAudio;
}

export interface IJsonPageVideo {
    lang_video_id: IJsonLocalizedVideoId;
    muted?: boolean;
    loop?: boolean;
    video_detail?: IJsonPageVideoDetail;
}

export interface IJsonPageVideoDetail {
    lang_video_id: IJsonLocalizedVideoId;
    desc?: ITranslatedValue<string>;
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

export interface IJsonLocalizedAudioSource extends ITranslatedValue<string> {
    en: string; // Only english is mandatory
}

export interface IJsonLocalizedVideoId extends ITranslatedValue<string> {
    en: string; // Only english is mandatory
}
