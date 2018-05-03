export interface IJsonVideo {
    video_id: string;
    legacy_src: string;
    sources: IJsonVideoSource[];
    meta: IJsonVideoMeta;
    covers?: string[];
    tracks: IJsonVideoTracks;
    legacy_tracks?: IJsonVideoTracks;
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
}
export interface IJsonVideoTracks {
    // i.e
    //  en: string;
    //  fr: string;
    [key: string]: string;
}
