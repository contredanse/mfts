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

    public getFlatMenu(): IJsonMenu[] | undefined {
        if (this.flatMenu === undefined) {
            this.flatMenu = this.flatten(this.menu);
        }
        return this.flatMenu;
    }

    public getPreviousPageId(): string {
        return 'cool';
    }

    public findMenu(menuId: string): IJsonMenu | undefined {
        const flatMenu = this.getFlatMenu();
        if (flatMenu === undefined) {
            return undefined;
        }
        const menu = flatMenu.find((element: IJsonMenu) => {
            return menuId === element.id;
        });
        return menu;
    }

    public findMenuOfPage(pageId: string): IJsonMenu {
        return {} as IJsonMenu;
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
