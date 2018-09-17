import { appConfig } from '../../../../config/config.production';
import { PageProxyFactory } from '../page-proxy';
import AppAssetsLocator from '../../../core/app-assets-locator';

describe('Data page retrieval', () => {
    const globalDataRepo = appConfig.getPageRepository();
    const pageId = 'forms.crescent-roll.crescent-led-by-feet-and-hands';

    test('PageProxy properties', async () => {
        const page = globalDataRepo.getPageProxy(pageId);
        expect(page).toBeDefined();

        if (page !== undefined) {
            expect(page.countVideos()).toEqual(3);
            expect(page.hasAudio()).toBeTruthy();
            expect(page.getAudioEntity()).toBeDefined();
        }
    });

    test('PageProxy getting videos', async () => {
        const page = globalDataRepo.getPageProxy(pageId);
        expect(page).toBeDefined();

        if (page !== undefined) {
            const videos = await page.getVideos('en');
            expect(videos.length).toBe(page.countVideos());
            expect(page.getFirstVideo('en')!.videoId).toEqual(videos[0].videoId);
        }
    });

    test('isMultiLayout', async () => {
        [
            { pageId: 'sensation-and-senses.basics.an-approach-to-the-small-dance', multi: true },
            { pageId: 'sensation-and-senses.pointing.parts-of-pointing', multi: false },
            { pageId: 'forms.crescent-roll.head-up', multi: true },
        ].map((val, idx) => {
            const { pageId: id, multi } = val;
            const p = globalDataRepo.getPageProxy(id);
            expect(p).toBeDefined();
            if (p !== undefined) {
                expect(p.isMultiLayout()).toEqual(multi);
            }
        });
    });
});

describe('Data page factory', () => {
    const jsonPage = {
        page_id: 'page_id',
        name: {
            en: 'name_en',
            fr: 'name_fr',
        },
        title: {
            en: 'title_en',
            fr: 'title_fr',
        },
        sort_idx: 10,
        cover: 'cover.jpg',
        keywords: {
            en: ['keyword'],
            fr: ['mots-clés'],
        },
        content: {
            videos: [
                {
                    lang_video_id: {
                        en: 'new_intro',
                    },
                    video_detail: {
                        lang_video_id: {
                            en: 'cbfh_side',
                        },
                        muted: true,
                        desc: {
                            en: 'desc_en',
                            fr: 'desc_fr',
                        },
                    },
                },
                {
                    lang_video_id: {
                        en: 'cbhf_fromtop',
                    },
                    video_detail: {
                        lang_video_id: {
                            en: 'cbfh_top',
                        },
                        muted: true,
                        desc: {
                            en: 'desc_en',
                            fr: 'desc_fr',
                        },
                    },
                },
            ],
            audio: {
                src: {
                    en: 'comments_crescent.mp3',
                },
                tracks: [
                    {
                        lang: 'en',
                        src: 'comments_crescent.en.vtt',
                    },
                    {
                        lang: 'fr',
                        src: 'comments_crescent.fr.vtt',
                    },
                ],
            },
        },
    };

    const assetsLocator = new AppAssetsLocator({
        assetsUrls: {
            default: 'http://default',
            audioSubs: 'http://audiosubs',
            videoSubs: 'http://videos',
            videos: 'http://videossubs',
        },
    });

    const page = PageProxyFactory.createFromJson(jsonPage, appConfig.getVideoRepository(), {
        assetsLocator: assetsLocator,
        fallbackLang: 'en',
    });

    const tracks = page.getAudioEntity()!.getAllTracks();
    expect(tracks.length).toEqual(2);
    expect(tracks[0]).toEqual({ lang: 'en', src: 'http://audiosubs/comments_crescent.en.vtt' });
});
