import dataMenu from '@data/json/data-menu.json';
import dataVideos from '@data/json/data-videos.json';
import dataPages from '@data/json/data-pages.json';
import AppConfig from '@src/core/app-config';
import { IJsonMenu } from '@data/json/data-menu';
import { IJsonPage } from '@data/json/data-pages';
import { IJsonVideo } from '@data/json/data-videos';

const apiBaseUrl = process.env.API_BASE_URL || 'http://error.api_url_config.local';
const mediaAssetsServerBaseUrl = process.env.ASSETS_BASE_URL || 'http://error.assets_url_config.local';

export const appConfig = new AppConfig({
    apiBaseUrl: apiBaseUrl,
    assetsLocatorProps: {
        assetsUrls: {
            default: mediaAssetsServerBaseUrl,
            pageCovers: `${mediaAssetsServerBaseUrl}/pages/covers`,
            videos: `${mediaAssetsServerBaseUrl}/videos`,
            videoCovers: `${mediaAssetsServerBaseUrl}/videos/covers`,
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
    externalUrls: {
        myAccount: process.env.MY_ACCOUNT_URL || '/404-externalUrls-config-error',
        resetPassword: process.env.RESET_PASSWORD_URL || '/404-externalUrls-config-error',
        shopLink: process.env.SHOP_SUBSCRIPTION_URL || '/404-externalUrls-config-error',
    },
});
