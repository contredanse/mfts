import { IDataPage } from '@data/data-pages';

export interface IParams {
    defaultLang: 'en' | 'fr';
}

export default class DataRepository<IParams> {
    protected readonly params: IParams;
    protected readonly data: any[];

    constructor(data: any[], params: IParams) {
        this.params = params;
        this.data = data;
    }

    public getParams(): IParams {
        return this.params;
    }

    /**
     * Get page information
     * @param {string} pageId
     * @returns {Promise<IDataPage>}
     */
    async getPage(pageId: string): Promise<IDataPage> {
        return new Promise<IDataPage>((resolve, reject) => {
            const page = this.data.find((element: IDataPage) => {
                return pageId === element.id;
            });
            if (page === undefined) {
                reject(`Page '${pageId}' cannot be found`);
            }
            resolve(page);
        });
    }
}
