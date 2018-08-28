import AppConfig from '@src/core/app-config';
import { IJsonMenu } from '@data/json/data-menu';

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

    public getPrevAndNextPageIds(
        pageId: string
    ): {
        previous: IJsonMenu | undefined;
        current: IJsonMenu | undefined;
        next: IJsonMenu | undefined;
    } {
        let next = undefined;
        let previous = undefined;
        let current = undefined;

        const pageMenu = this.getFlatMenu().filter(item => {
            return item.type === 'page';
        });

        pageMenu.forEach((item, idx) => {
            if (item.page_id === pageId) {
                current = item;
                if (idx > 0) {
                    previous = pageMenu[idx - 1];
                }
                if (idx < pageMenu.length - 2) {
                    next = pageMenu[idx + 1];
                }
            }
        });

        return {
            previous: previous,
            current: current,
            next: next,
        };
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
