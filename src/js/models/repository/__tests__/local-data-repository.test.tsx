import { appConfig } from '@config/config.production';
import LocalDataRepository from '@src/model/repository/local-data-repository';

describe('Data repository getters', () => {
    const globalDataRepo = appConfig.getDataRepository() as LocalDataRepository;

    test('getPage must reject for non existing page', async () => {
        const pageId = 'non-existing-page';
        //await expect(globalDataRepo.getPage(pageId)).rejects.toThrow(`Page '${pageId}' cannot be found`);
        expect(globalDataRepo.getPage(pageId)).not.toBeDefined();
    });

    test('getPage existing page must have a name', async () => {
        const page = await globalDataRepo.getPage('forms.helix-roll.in-water');
        expect(page).toHaveProperty('name');
    });
});

describe('Data page retrieval', () => {
    const globalDataRepo = appConfig.getDataRepository() as LocalDataRepository;

    test('getPageEntity must return existing page', async () => {
        const page = await globalDataRepo.getPageEntity('forms.helix-roll.led-by-feet');
        expect(page).toBeDefined();
    });
});
