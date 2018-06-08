import dataMenu from '@data/json/data-menu.json';
import dataVideos from '@data/json/data-videos.json';
import dataPages from '@data/json/data-pages.json';
import AppConfig from '@src/core/app-config';

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
        menu: dataMenu,
        pages: dataPages,
        videos: dataVideos,
    },
});
