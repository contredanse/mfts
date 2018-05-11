import { appConfig } from '@config/config.production';
import LocalDataRepository from '@src/models/repository/local-data-repository';
import { PageEntityFactory } from '@src/models/entity/page-entity';
import AppAssetsLocator from '@src/core/app-assets-locator';

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

describe('Data page factory', () => {
    const globalDataRepo = appConfig.getDataRepository() as LocalDataRepository;

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
            layout: 'three-videos-audio-subs',
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
                            en: '-- led by feet and hands - detail from side',
                            fr: '-- initié par le les mains et les pieds - détail - depuis le côté',
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
                            en: '-- led by feet and hands - detail from top',
                            fr: '-- initié par le les mains et les pieds - détail - depuis le haut',
                        },
                    },
                },
                {
                    lang_video_id: {
                        en: 'cbhf_fromhead',
                    },
                    video_detail: {
                        lang_video_id: {
                            en: 'cbfh_front',
                        },
                        muted: true,
                        desc: {
                            en: '-- led by feet and hands - detail from head',
                            fr: '-- initié par le les mains et les pieds - détail - depuis la tête',
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

    const page = PageEntityFactory.createFromJson(jsonPage, appConfig.getDataRepository(), {
        assetsLocator: assetsLocator,
        fallbackLang: 'en',
    });

    const tracks = page.getAudioEntity()!.getAllTracks();
    expect(tracks.length).toEqual(2);
    expect(tracks[0]).toEqual({ lang: 'en', src: 'http://audiosubs/comments_crescent.en.vtt' });

    const videoTracks = page.getFirstVideo()!.getAllTracks();
    console.log('videoTracks', videoTracks);
});
