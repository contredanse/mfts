export interface IVideoData {
    name: string;
    keywords?: (null)[] | null;
    sources: Sources;
    subs: Subs;
    meta: Meta;
    covers: (string)[];
}
export interface Sources {
    mp4: string;
}
export interface Subs {
    en?: null;
    fr?: null;
}
export interface Meta {
    duration?: null;
    width?: null;
    height?: null;
}