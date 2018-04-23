import DataProxy, { IParams } from '../data-proxy';
import { appConfig } from '@config/app-config';

describe('Data repository getDefaultParams', () => {
    test('getParams returns params from constructor', () => {
        const params: IParams = {
            defaultLang: 'en',
        };
        const dataRepo = new DataProxy({} as any, params);
        expect(dataRepo.getDefaultParams()).toEqual(params);
    });
});

describe('Data repository getters', () => {
    const params: IParams = {
        defaultLang: 'en',
    };

    const globalDataRepo = appConfig.getDataProxy(params);

    test('getPage must reject for non existing page', async () => {
        const pageId = 'non-existing-page';
        await expect(globalDataRepo.getPage(pageId)).rejects.toThrow(`Page '${pageId}' cannot be found`);
    });

    test('getPage existing page must have a name', async () => {
        const page = await globalDataRepo.getPage('forms.helix-roll.in-water');
        expect(page).toHaveProperty('name');
    });
});
