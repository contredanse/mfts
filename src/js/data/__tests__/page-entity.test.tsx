import { appConfig } from '@config/app-config';
import LocalDataRepository from '@src/data/local-data-repository';

describe('Data page retrieval', () => {
    const globalDataRepo = appConfig.getDataRepository() as LocalDataRepository;

    test('PageEntity must return videos/audio and tracks', async () => {
        const pageId = 'forms.crescent-roll.crescent-led-by-feet-and-hands';
        const page = await globalDataRepo.getPageEntity(pageId, 'en');
        expect(page.countVideos()).toEqual(3);
        expect(page.videos.length).toEqual(3);
        expect(page.hasAudio()).toBeTruthy();
        expect(page.getAudioEntity()).not.toBeUndefined();
    });
});
