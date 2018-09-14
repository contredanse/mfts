import AppConfig from '@src/core/app-config';
import { IJsonMenu } from '@data/json/data-menu';
import PageRepository from '@src/models/repository/page-repository';
import PageEntity from '@src/models/entity/page-entity';
import { Omit } from 'utility-types';

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

export type PrevAndNextPageEntities = {
    previousPage?: PageEntity;
    nextPage?: PageEntity;
};

export default class MenuRepository {
    protected readonly menu: IJsonMenu[];
    protected readonly config: AppConfig;
    protected flatMenu!: IJsonMenu[];

    constructor(config: AppConfig, menu: IJsonMenu[]) {
        this.menu = menu;
        this.config = config;
    }

    static mapIJsonMenuToPageMenuInfo(item: IJsonMenu, lang: string = 'en'): PageMenuInfo {
        const { id, page_id, title_en, title_fr } = item;
        return {
            id: id,
            page_id: page_id !== undefined ? page_id : 'invalid_page_id',
            title: lang === 'fr' && title_fr !== undefined ? title_fr : title_en,
        };
    }

    getFlatMenu(): IJsonMenu[] {
        if (this.flatMenu === undefined) {
            this.flatMenu = this.flatten(this.menu);
        }
        return this.flatMenu;
    }

    getJsonMenu(): IJsonMenu[] {
        return this.menu;
    }

    getPrevAndNextPageEntityMenu(
        pageId: string,
        lang: string,
        pageRepository: PageRepository
    ): PrevAndNextPageEntities {
        const menuPage: PrevAndNextPageEntities = {};

        const { previous, next } = this.getPrevAndNextPageMenu(pageId, lang);

        menuPage.previousPage = previous !== undefined ? pageRepository.getPageEntity(previous.page_id) : undefined;
        menuPage.nextPage = next !== undefined ? pageRepository.getPageEntity(next.page_id) : undefined;

        return menuPage;
    }

    getPrevAndNextPageMenu(pageId: string, lang: string): PrevAndNextPageId {
        const prevAndNextMenuPage: PrevAndNextPageId = {};

        const pageMenu = this.getFlatMenu().filter(item => {
            return item.type === 'page';
        });

        pageMenu.forEach((item, idx) => {
            if (item.page_id === pageId) {
                prevAndNextMenuPage.current = MenuRepository.mapIJsonMenuToPageMenuInfo(item, lang);
                if (idx > 0) {
                    prevAndNextMenuPage.previous = MenuRepository.mapIJsonMenuToPageMenuInfo(pageMenu[idx - 1], lang);
                }
                if (idx < pageMenu.length - 1) {
                    prevAndNextMenuPage.next = MenuRepository.mapIJsonMenuToPageMenuInfo(pageMenu[idx + 1], lang);
                }
            }
        });

        return prevAndNextMenuPage;
    }

    getPageBreadcrumb(pageId: string, lang: string): any {
        /*
        function loop(obj: any, path: any, breadcrumbs: any) {
            Object.keys(obj).forEach(k => {
                if (obj[k].content) loop(obj[k].content, [...path, k], breadcrumbs);
                else breadcrumbs[obj[k]] = [...path, k];
            });
        }

        let breadcrumbs  = {};
        loop(this.menu, ['title_fr'], breadcrumbs);
        */

        const accu: any = {};
        const p = this.searchMenuTree(this.menu, 'forms.cultivating.dance-culture', accu);

        /*
        const p = this.menu.find((item) => {

            console.log('item', item);
            return item.page_id === 'forms.cultivating.dance-culture'
        })
*/
        console.log('p', p);
        console.log('accu', accu);

        return p;
        /*
        const pageMenu = this.getFlatMenu().filter(item => {
            //return item.type === 'section';
            return true;
        });

        return pageMenu;
        */
    }

    findMenuByPageId(pageId: string): IJsonMenu | undefined {
        /*
        const flatMenu = this.getFlatMenu();
        const menu = flatMenu.find((element: IJsonMenu) => {
            return pageId === element.page_id;
        });
        return menu;
        */
        const res = this.searchMenuTree(this.menu, pageId);
        return res === null ? undefined : res;
    }

    findMenuSection(menuId: string): IJsonMenu | undefined {
        const flatMenu = this.getFlatMenu();
        const menu = flatMenu.find((element: IJsonMenu) => {
            return menuId === element.id;
        });
        return menu;
    }

    protected searchMenuTree(
        element: IJsonMenu[] | IJsonMenu,
        pageId: string,
        breadcrumb: { [key: string]: Omit<IJsonMenu, 'type' | 'content'> } = {}
    ): IJsonMenu | null {
        if (Array.isArray(element)) {
            let result = null;
            for (let i = 0; result === null && i < element.length; i++) {
                if (element[i].type === 'section') {
                    const level = element[i].id!.split('.').length;
                    breadcrumb[`level_${level}`] = {
                        id: element[i].id,
                        title_fr: element[i].title_fr,
                        title_en: element[i].title_en,
                    };
                }
                result = this.searchMenuTree(element[i], pageId, breadcrumb);
            }
            return result;
        } else if (element.content !== undefined) {
            let result = null;
            for (let i = 0; result === null && i < element.content.length; i++) {
                if (element.content[i].type === 'section') {
                    const level = element.content[i].id!.split('.').length;
                    breadcrumb[`level${level}`] = {
                        id: element.content[i].id,
                        title_fr: element.content[i].title_fr,
                        title_en: element.content[i].title_en,
                    };
                }
                result = this.searchMenuTree(element.content[i], pageId, breadcrumb);
            }
            return result;
        } else if (element.page_id === pageId) {
            return element;
        }
        return null;
    }

    protected flatten(data: IJsonMenu[]): IJsonMenu[] {
        const result = [] as any[];
        data.forEach(item => {
            if (Array.isArray(item.content)) {
                result.push({
                    type: item.type,
                    id: item.id,
                    page_id: item.page_id,
                    title_en: item.title_en,
                    title_fr: item.title_fr,
                } as IJsonMenu);
                // recursively add the children
                result.push(...this.flatten(item.content));
            } else {
                result.push(item);
            }
        });
        return result;
    }
}
