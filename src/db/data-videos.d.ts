export interface IJsonVideo {
    video_id: string;
    legacy_src: string;
    sources: IDataVideoSource[];
    meta: IDataVideoMeta;
    covers?: string[];
    tracks: IDataVideoTracks;
    legacy_tracks?: IDataVideoTracks;
}
export interface IDataVideoSource {
    src: string;
    priority?: number;
    type?: string;
    codecs?: string;
}
export interface IDataVideoMeta {
    duration: number;
    width?: number;
    height?: number;
}
export interface IDataVideoTracks {
    // i.e
    //  en: string;
    //  fr: string;
    [key: string]: string;
}
