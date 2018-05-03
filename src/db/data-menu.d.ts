export interface IJsonMenu {
    type: string;
    id: string;
    title_en: string;
    title_fr: string;
    content?: (IJsonContentEntity)[];
}
export interface IJsonContentEntity {
    type: string;
    page_id?: string | null;
    title_en: string;
    title_fr: string;
    id?: string | null;
    content?: (IJsonContentEntity1)[];
}
export interface IJsonContentEntity1 {
    type: string;
    page_id: string;
    title_en: string;
    title_fr: string;
}
