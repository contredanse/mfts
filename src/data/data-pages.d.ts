export interface IDataPage {
  id: string;
  name: NameOrTitleOrSubs;
  title: NameOrTitleOrSubs;
  keywords: Keywords;
  content: Content;
}
export interface NameOrTitleOrSubs {
  en: string;
  fr: string;
}
export interface Keywords {
  en?: (string)[];
  fr?: (string)[];
}
export interface Content {
  layout: string;
  video?: VideoOrEnOrFrOrVideosEntity | null;
  video_i18n?: VideoI18n | null;
  audio_i18n?: AudioI18n | null;
  videos?: (VideoOrEnOrFrOrVideosEntity1)[] | null;
  audio?: EnOrFrOrAudio | null;
  subs?: NameOrTitleOrSubs1 | null;
}
export interface VideoOrEnOrFrOrVideosEntity {
  video_id: string;
  muted: boolean;
  loop: boolean;
}
export interface VideoI18n {
  en: VideoOrEnOrFrOrVideosEntity1;
  fr: VideoOrEnOrFrOrVideosEntity1;
}
export interface VideoOrEnOrFrOrVideosEntity1 {
  video_id: string;
  muted: boolean;
  loop: boolean;
}
export interface AudioI18n {
  en: EnOrFrOrAudio1;
  fr: EnOrFrOrAudio1;
}
export interface EnOrFrOrAudio1 {
  src: string;
}
export interface EnOrFrOrAudio {
  src: string;
}
export interface NameOrTitleOrSubs1 {
  en: string;
  fr: string;
}
