import { IDataPage } from '@data/data-pages';

export default class PageRepository {

    public readonly data: IDataPage[];

    constructor(data: IDataPage[]) {
        this.data = data;
    }

    async get(id: string): Promise<IDataPage> {
        return new Promise<IDataPage>((resolve, reject) => {
            const page = this.data.find((element: IDataPage) => {
                return id === element.id;
            })
            if (page === undefined) {
                reject(`Page '${id}' cannot be found`);
            }
            resolve(page);
        })
    }

}
