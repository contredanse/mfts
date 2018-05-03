import VideoEntity from '@model/video-entity';
import PageEntity from '@model/page-entity';

export type DataSupportedLangType = 'en' | 'fr';

export interface IDataRepositoryParams {
    defaultLang: DataSupportedLangType;
    assetsBaseUrl: string;
    urlPaths: {
        video: string;
        audio: string;
        videoCovers: string;
    };
}

export interface IDataRepository {
    getVideoEntity(videoId: string): Promise<VideoEntity>;
    getPageEntity(pageId: string, lang: DataSupportedLangType): Promise<PageEntity>;
}
