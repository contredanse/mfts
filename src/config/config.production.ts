import dataMenu from '@data/json/data-menu.json';
import dataVideos from '@data/json/data-videos.json';
import dataPages from '@data/json/data-pages.json';
import AppConfig from '@src/core/app-config';
import { IJsonMenu } from '@data/json/data-menu';
import { IJsonPage } from '@data/json/data-pages';
import { IJsonVideo } from '@data/json/data-videos';

// without ending slash !
const mediaAssetsServerBaseUrl = 'https://paxton.soluble.io/assets';

export const appConfig = new AppConfig({
    assetsLocatorProps: {
        assetsUrls: {
            default: mediaAssetsServerBaseUrl,
            pageCovers: `${mediaAssetsServerBaseUrl}/page-covers`,
            videos: `${mediaAssetsServerBaseUrl}/videos`,
            videoCovers: `${mediaAssetsServerBaseUrl}/videos`,
            videoSubs: `${mediaAssetsServerBaseUrl}/videos`,
            audios: `${mediaAssetsServerBaseUrl}/audio`,
            audioSubs: `${mediaAssetsServerBaseUrl}/audio`,
        },
    },
    fallbackLang: 'en',
    data: {
        menu: dataMenu as IJsonMenu[],
        pages: dataPages as IJsonPage[],
        videos: dataVideos as IJsonVideo[],
    },
});
