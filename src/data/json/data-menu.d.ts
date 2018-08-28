type JsonMenuNodeType = 'page' | 'section';

export interface IJsonMenu {
    type: JsonMenuNodeType;
    id: string;
    page_id?: string;
    title_en: string;
    title_fr: string;
    content?: IJsonMenu[];
}
