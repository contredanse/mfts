import { ITranslatedValue } from '@src/models/entity/abstract-base-entity';

export interface IJsonVideo {
    video_id: string;
    sources: IJsonVideoSource[];
    meta: IJsonVideoMeta;
    covers?: string[];
    tracks?: IJsonVideoTrack[];
}
export interface IJsonVideoSource {
    src: string;
    priority?: number;
    type?: string;
    codecs?: string;
}
export interface IJsonVideoMeta {
    duration: number;
    size?: string;
    no_audio?: boolean;
}

export interface IJsonVideoTrack {
    lang: string;
    src: string;
}
