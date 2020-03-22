import AppConfig from '@src/core/app-config';
import { IJsonMenu, IJsonMenuPage, IJsonMenuSection } from '@data/json/data-menu';
import PageRepository from '@src/models/repository/page-repository';
import PageProxy from '@src/models/proxy/page-proxy';
import { Omit } from 'utility-types';

export type MenuPageProps = {
    page_id: string;
    title: string;
};

export type MenuSectionProps = {
    id: string;
    title: string;
};

export type PrevAndNextPageId = {
    previous?: MenuPageProps;
    current?: MenuPageProps;
    next?: MenuPageProps;
};

export type PrevAndNextPageEntities = {
    previousPage?: PageProxy;
    nextPage?: PageProxy;
};

export default class MenuRepository {
    private readonly menu: IJsonMenu[];
    private readonly config: AppConfig;
    private readonly pageRepository?: PageRepository;

    private flatMenu!: IJsonMenu[];

    constructor(config: AppConfig, menu: IJsonMenu[], pageRepository?: PageRepository) {
        this.menu = menu;
        this.config = config;
        this.pageRepository = pageRepository;
    }

    static mapIJsonMenuToPageMenuInfo(item: IJsonMenu, lang: string = 'en'): MenuPageProps {
        const { page_id, title_en, title_fr } = item;
        return {
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
        pageRepository?: PageRepository
    ): PrevAndNextPageEntities {
        const menuPage: PrevAndNextPageEntities = {};
        const { previous, next } = this.getPrevAndNextPageMenu(pageId, lang);
        const pr = pageRepository ? pageRepository : this.pageRepository;
        if (!pr) {
            throw new Error('Missing pageRepository prop or argument');
        }

        menuPage.previousPage = previous !== undefined ? pr.getPageProxy(previous.page_id) : undefined;
        menuPage.nextPage = next !== undefined ? pr.getPageProxy(next.page_id) : undefined;

        return menuPage;
    }

    getPrevAndNextPageMenu(pageId: string, lang: string): PrevAndNextPageId {
        const prevAndNextMenuPage: PrevAndNextPageId = {};

        const pageMenu = this.getFlatMenu().filter((item) => {
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

    getPageBreadcrumb(pageId: string, lang: string): MenuSectionProps[] {
        const accu: IJsonMenuSection[] = [];
        this.searchMenuTree(this.menu, pageId, accu);
        const breadcrumb: MenuSectionProps[] = [];
        accu.forEach((menuItem, idx) => {
            breadcrumb[idx] = {
                id: menuItem.id,
                title: lang === 'fr' ? menuItem.title_fr : menuItem.title_en,
            } as MenuSectionProps;
        });

        return breadcrumb;
    }

    findMenuByPageId(pageId: string): IJsonMenu | undefined {
        const res = this.searchMenuTree(this.menu, pageId);
        return res === null ? undefined : res;
    }

    findMenuSection(menuId: string): IJsonMenu | undefined {
        const flatMenu = this.getFlatMenu();
        return flatMenu.find((element: IJsonMenu) => {
            return menuId === element.id;
        });
    }

    /**
     * Return the menu location of a specific page. The breadcrumb
     * argument
     * @param breadcrumb an array that will be filled with menu levels (accumulator)
     */
    protected searchMenuTree(
        menu: IJsonMenu | IJsonMenu[],
        pageId: string,
        breadcrumb?: Omit<IJsonMenuSection, 'content'>[]
    ): IJsonMenu | null {
        const levelsToSearch = pageId.split('.').length;

        if ('page_id' in menu && menu.page_id === pageId) {
            return menu;
        } else if ('content' in menu || Array.isArray(menu)) {
            let result = null;
            const children: IJsonMenu[] = Array.isArray(menu) ? menu : menu.content || [];
            for (let i = 0; result === null && i < children.length; i++) {
                const child = children[i] as IJsonMenuSection & IJsonMenuPage;
                if (breadcrumb !== undefined && children[i].type === 'section') {
                    const level = child.id.split('.').length;
                    if (level < levelsToSearch) {
                        breadcrumb[level - 1] = {
                            id: child.id,
                            title_fr: children[i].title_fr,
                            title_en: children[i].title_en,
                        };
                    }
                }
                result = this.searchMenuTree(children[i], pageId, breadcrumb);
            }
            return result;
        }
        return null;
    }

    protected flatten(data: IJsonMenu[]): IJsonMenu[] {
        const result = [] as any[];
        data.forEach((item) => {
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
