export interface IDataVideo {
  video_id: string;
  legacy_src: string;
  sources: Sources;
  meta: Meta;
  thumbnail: string;
  tracks?: TracksOrLegacyTracks | null;
  legacy_tracks?: TracksOrLegacyTracks1 | null;
}
export interface Sources {
  webm: string;
  mp4: string;
}
export interface Meta {
  duration: number;
  width?: number | null;
  height?: number | null;
}
export interface TracksOrLegacyTracks {
  en: string;
  fr: string;
}
export interface TracksOrLegacyTracks1 {
  en: string;
  fr: string;
}
