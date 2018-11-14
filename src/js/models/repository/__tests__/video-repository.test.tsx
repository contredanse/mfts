import { appConfig } from '@config/config';

describe('Video repository getters', () => {
    const videoRepo = appConfig.getVideoRepository();

    test('getVideo must reject for non existing video', async () => {
        const videoId = 'non-existing-video';
        expect(videoRepo.getVideo(videoId)).not.toBeDefined();
    });

    test('getVideo existing page must have a name', async () => {
        const page = await videoRepo.getVideo('hello');
        expect(page).toHaveProperty('sources');
    });
});
