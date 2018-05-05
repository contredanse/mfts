type JsonMenuNodeType = 'page' | 'section';

export interface IJsonMenu {
    type: JsonMenuNodeType;
    id: string;
    title_en: string;
    title_fr: string;
    content?: (IJsonContent)[];
}
export interface IJsonContent {
    type: JsonMenuNodeType;
    id?: string;
    page_id?: string;
    title_en: string;
    title_fr: string;
    content?: (IJsonContent)[];
}
