import { ITranslatedValue } from '@src/model/entity/abstract-base-entity';

export interface IJsonVideo {
    video_id: string;
    sources: IJsonVideoSource[];
    meta: IJsonVideoMeta;
    covers?: string[];
    tracks?: IJsonVideoTracks;
}
export interface IJsonVideoSource {
    src: string;
    priority?: number;
    type?: string;
    codecs?: string;
}
export interface IJsonVideoMeta {
    duration: number;
    width?: number;
    height?: number;
    no_audio?: boolean;
}
export interface IJsonVideoTracks extends ITranslatedValue<string> {
    en: string; // English is required for VideoTracks
}
