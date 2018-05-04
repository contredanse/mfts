import { appConfig } from '@config/app-config';
import LocalDataRepository from '@src/model/repository/local-data-repository';

describe('Data page retrieval', () => {
    const globalDataRepo = appConfig.getDataRepository() as LocalDataRepository;
    const pageId = 'forms.crescent-roll.crescent-led-by-feet-and-hands';

    test('PageEntity properties', async () => {
        const page = globalDataRepo.getPageEntity(pageId);
        expect(page).toBeDefined();

        if (page !== undefined) {
            expect(page.countVideos()).toEqual(3);
            expect(page.hasAudio()).toBeTruthy();
            expect(page.getAudioEntity()).toBeDefined();
        }
    });

    test('PageEntity getting videos', async () => {
        const page = globalDataRepo.getPageEntity(pageId);
        expect(page).toBeDefined();

        if (page !== undefined) {
            const videos = await page.getVideos('en');
            expect(videos.length).toBe(page.countVideos());
            expect(page.getFirstVideo('en')).toEqual(videos[0]);
        }
    });
});
