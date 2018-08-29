import AppConfig from '@src/core/app-config';
import { IJsonMenu, JsonMenuNodeType } from '@data/json/data-menu';
import PageRepository from '@src/models/repository/page-repository';
import PageEntity from '@src/models/entity/page-entity';

export type PageMenuInfo = {
    id: string;
    page_id: string;
    title: string;
};

export type PrevAndNextPageId = {
    previous?: PageMenuInfo;
    current?: PageMenuInfo;
    next?: PageMenuInfo;
};

export type PrevAndNextPageEntity = {
    previous?: PageEntity;
    next?: PageEntity;
};

export default class MenuRepository {
    protected readonly menu: IJsonMenu[];
    protected readonly config: AppConfig;
    protected flatMenu!: IJsonMenu[];

    constructor(config: AppConfig, menu: IJsonMenu[]) {
        this.menu = menu;
        this.config = config;
    }

    public getFlatMenu(): IJsonMenu[] {
        if (this.flatMenu === undefined) {
            this.flatMenu = this.flatten(this.menu);
        }
        return this.flatMenu;
    }

    public getJsonMenu(): IJsonMenu[] {
        return this.menu;
    }

    public mapIJsonMenuToPageMenuInfo(item: IJsonMenu, lang: string = 'en'): PageMenuInfo {
        const { id, page_id, title_en, title_fr } = item;
        return {
            id: id,
            page_id: page_id !== undefined ? page_id : 'invalid_page_id',
            title: lang === 'fr' && title_fr !== undefined ? title_fr : title_en,
        };
    }

    public getPrevAndNextPageEntityMenu(
        pageId: string,
        lang: string,
        pageRepository: PageRepository
    ): PrevAndNextPageEntity {
        const menuPage: PrevAndNextPageEntity = {};

        const { previous, next } = this.getPrevAndNextPageMenu(pageId, lang);

        if (previous !== undefined) {
            menuPage.previous = pageRepository.getPageEntity(previous.page_id);
        } else if (next !== undefined) {
            menuPage.next = pageRepository.getPageEntity(next.page_id);
        }

        return menuPage;
    }

    public getPrevAndNextPageMenu(pageId: string, lang: string): PrevAndNextPageId {
        const prevAndNextMenuPage: PrevAndNextPageId = {};

        const pageMenu = this.getFlatMenu().filter(item => {
            return item.type === 'page';
        });

        pageMenu.forEach((item, idx) => {
            if (item.page_id === pageId) {
                prevAndNextMenuPage.current = this.mapIJsonMenuToPageMenuInfo(item, lang);
                if (idx > 0) {
                    prevAndNextMenuPage.previous = this.mapIJsonMenuToPageMenuInfo(pageMenu[idx - 1], lang);
                }
                if (idx < pageMenu.length - 2) {
                    prevAndNextMenuPage.next = this.mapIJsonMenuToPageMenuInfo(pageMenu[idx + 1], lang);
                }
            }
        });

        return prevAndNextMenuPage;
    }

    public findMenuByPageId(pageId: string): IJsonMenu | undefined {
        const flatMenu = this.getFlatMenu();
        const menu = flatMenu.find((element: IJsonMenu) => {
            return pageId === element.page_id;
        });
        return menu;
    }

    public findMenu(menuId: string): IJsonMenu | undefined {
        const flatMenu = this.getFlatMenu();
        const menu = flatMenu.find((element: IJsonMenu) => {
            return menuId === element.id;
        });
        return menu;
    }

    protected flatten(data: IJsonMenu[]): any[] {
        const result = [] as any[];
        data.forEach(item => {
            if (Array.isArray(item.content)) {
                result.push({
                    type: item.type,
                    id: item.id,
                    page_id: item.page_id,
                    title_en: item.title_en,
                    title_fr: item.title_fr,
                });
                // recursively add the children
                result.push(...this.flatten(item.content));
            } else {
                result.push(item);
            }
        });
        return result;
    }
}
