import { appConfig } from '@config/app-config';
import LocalDataRepository from '@model/repository/local-data-repository';

describe('Data repository getters', () => {
    const globalDataRepo = appConfig.getDataRepository() as LocalDataRepository;

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
    const globalDataRepo = appConfig.getDataRepository() as LocalDataRepository;

    test('getPageEntity must return existing page', async () => {
        const page = await globalDataRepo.getPageEntity('forms.helix-roll.led-by-feet');
        expect(page).toBeDefined();
    });
});
