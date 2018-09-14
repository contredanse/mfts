type JsonMenuNodeType = 'page' | 'section';

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

export type IJsonMenu = IJsonMenuSection &
    IJsonMenuPage & {
        type: JsonMenuNodeType;
        id?: string;
        page_id?: string;
    };

/*
type JsonMenuNodeType = 'page' | 'section';


export interface IJsonMenuSection {
    id: string;
}

export interface IJsonMenuLocalizedTitles {
    title_en: string;
    title_fr: string;
}

export interface IJsonMenuSection extends IJsonMenuLocalizedTitles {
    id: string;
    content?: IJsonMenu[];
}


export interface IJsonMenuPage extends IJsonMenuLocalizedTitles {
    page_id: string;
}


export interface IJsonMenu extends IJsonMenuSection, IJsonMenuPage {
    type: JsonMenuNodeType;
    id?: string;
    page_id?: string;
}
*/
