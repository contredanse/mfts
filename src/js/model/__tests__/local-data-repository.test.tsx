import { appConfig } from '@config/app-config';
import LocalDataRepository from '@model/local-data-repository';

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

    test('getPageEntity must respect translations', async () => {
        const pageFr = await globalDataRepo.getPageEntity('forms.helix-roll.led-by-feet', 'fr');
        const pageEn = await globalDataRepo.getPageEntity('forms.helix-roll.led-by-feet', 'en');
        expect(pageFr).toHaveProperty('title');
        expect(pageFr.title).not.toEqual(pageEn.title);
        expect(pageFr.keywords).not.toEqual(pageEn.keywords);
        expect(pageFr.name).not.toEqual(pageEn.name);
    });
});
