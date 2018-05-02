import VideoEntity from '@src/data/video-entity';
import PageEntity from '@src/data/page-entity';

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
