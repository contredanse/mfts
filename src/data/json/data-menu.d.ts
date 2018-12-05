export type IJsonMenuLocalizedTitles = {
    title_en: string;
    title_fr: string;
};

export type IJsonMenuSection = {
    id: string;
    content?: IJsonMenu[];
} & IJsonMenuLocalizedTitles;

export type IJsonMenuPage = {
    page_id: string;
} & IJsonMenuLocalizedTitles;

type JsonMenuNodeType = 'page' | 'section';

export type IJsonMenu = {
    type: JsonMenuNodeType;
    id?: string;
    page_id?: string;
    content?: IJsonMenu[];
} & IJsonMenuLocalizedTitles;
