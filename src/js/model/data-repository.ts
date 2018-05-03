import VideoEntity from '@model/entity/video-entity';
import PageEntity from '@model/entity/page-entity';

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
