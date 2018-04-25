export interface IDataVideo {
    video_id: string;
    legacy_src: string;
    sources: IDataVideoSources;
    meta: IDataVideoMeta;
    covers?: string[];
    tracks?: IDataVideoTracks;
    legacy_tracks?: IDataVideoTracks;
}
export interface IDataVideoSources {
    webm: string;
    mp4: string;
}
export interface IDataVideoMeta {
    duration: number;
    width?: number | null;
    height?: number | null;
}
export interface IDataVideoTracks {
    en: string;
    fr: string;
}
