import AppConfig from '@src/core/app-config';
import { IJsonPage } from '@data/json/data-pages';
import { IJsonVideo } from '@data/json/data-videos';
import { IJsonMenu } from '@data/json/data-menu';
import { IAssetsTypeUrls } from '@src/core/app-assets-locator';

describe('AppConfig test', () => {
    const assetsTypeUrls: IAssetsTypeUrls = {
        default: 'http://default',
        videos: 'http://videos',
        videoCovers: 'http://videocovers',
        videoSubs: 'http://videosubs',
        audios: 'http://audios',
        audioSubs: 'http://audiosubs',
        pageCovers: 'http://pagecovers',
    };

    const appConfigTest = new AppConfig({
        assetsLocatorProps: {
            assetsUrls: assetsTypeUrls,
        },
        apiBaseUrl: 'http://api.com/',
        data: {
            pages: [] as IJsonPage[],
            videos: [] as IJsonVideo[],
            menu: [] as IJsonMenu[],
        },
        fallbackLang: 'en',
    });

    it('should return appAssetsLocator', () => {
        const { assetsLocator } = appConfigTest;
        expect(assetsLocator.props.assetsUrls).toEqual(assetsTypeUrls);
    });
});
