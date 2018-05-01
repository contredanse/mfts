export interface IDataMenu {
    type: string;
    id: string;
    title_en: string;
    title_fr: string;
    content?: (ContentEntity)[] | null;
}
export interface ContentEntity {
    type: string;
    page_id?: string | null;
    title_en: string;
    title_fr: string;
    id?: string | null;
    content?: (ContentEntity1)[] | null;
}
export interface ContentEntity1 {
    type: string;
    page_id: string;
    title_en: string;
    title_fr: string;
}
