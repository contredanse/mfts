import { appConfig } from '@config/config.production';

describe('Page repository getters', () => {
    const pageRepo = appConfig.getPageRepository();

    test('getPage must reject for non existing page', async () => {
        const pageId = 'non-existing-page';
        expect(pageRepo.getPage(pageId)).not.toBeDefined();
    });

    test('getPage existing page must have a title', async () => {
        const page = await pageRepo.getPage('forms.helix-roll.in-water');
        expect(page).toHaveProperty('title');
    });
});

describe('PageProxy retrieval', () => {
    const pageRepo = appConfig.getPageRepository();

    test('getPageProxy must return existing page', async () => {
        const page = pageRepo.getPageProxy('forms.helix-roll.led-by-feet');
        expect(page).toBeDefined();
    });
});
