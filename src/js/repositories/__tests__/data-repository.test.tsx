import DataRepository, { IParams } from '../data-repository';
import { appConfig } from '@config/app-config';

describe('Data repository params', () => {
    test('getParams returns params from constructor', () => {
        const params: IParams = {
            defaultLang: 'en',
        };
        const dataRepo = new DataRepository([], params);
        expect(dataRepo.getParams()).toEqual(params);
    });
});

describe('Data repository getters', () => {
    const params = {
        defaultLang: 'en',
    };
    const {pages: globalPageData} = appConfig.getConfig().data;
    const globalDataRepo = new DataRepository(globalPageData, params);

    test('getPage should reject for non existing page', async () => {
        await expect(globalDataRepo.getPage('non-existing-page')).rejects.toThrow(
            "Page 'non-existing-page' cannot be found"
        );
    });

    test('getPage existing page should have a name', async () => {
        const page = await globalDataRepo.getPage('forms.helix-roll.in-water');
        expect(page).toHaveProperty('name');
    });

});
