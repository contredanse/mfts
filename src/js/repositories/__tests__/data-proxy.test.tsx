import DataProxy, { IDataProxyParams } from '../data-proxy';
import { appConfig } from '@config/app-config';

describe('Data repository getDefaultParams', () => {
    test('getParams returns params from constructor', () => {
        const params: IDataProxyParams = {
            defaultLang: 'en',
        };
        const dataRepo = new DataProxy({} as any, params);
        expect(dataRepo.getDefaultParams()).toEqual(params);
    });
});

describe('Data repository getters', () => {
    const params: IDataProxyParams = {
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

describe('Data page retrieval', () => {
    const params: IDataProxyParams = {
        defaultLang: 'en',
    };
    const globalDataRepo = appConfig.getDataProxy(params);

    test('getPageEntity must respect translations', async () => {
        const pageFr = await globalDataRepo.getPageEntity('forms.helix-roll.led-by-feet', 'fr');
        const pageEn = await globalDataRepo.getPageEntity('forms.helix-roll.led-by-feet', 'en');
        expect(pageFr).toHaveProperty('title');
        expect(pageFr.title).not.toEqual(pageEn.title);
        expect(pageFr.keywords.concat()).not.toEqual(pageEn.keywords.concat());
        expect(pageFr.name).not.toEqual(pageEn.name);
    });
});
