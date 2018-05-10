import VideoEntity from '@src/models/entity/video-entity';
import PageEntity from '@src/models/entity/page-entity';
import { IJsonVideo } from '@data/json/data-videos';

export type DataSupportedLangType = 'en' | 'fr'; // | 'nl' | 'de' | 'es';

export interface IDataRepositoryParams {
    fallbackLang: DataSupportedLangType;
    assetsBaseUrl: string;
    videoBaseUrl: string;
    audioBaseUrl: string;
}

export interface IDataRepository {
    //getVideoEntity(videoId: string): Promise<VideoEntity>;
    getVideoEntity(videoId: string): VideoEntity | undefined;
    getPageEntity(pageId: string): PageEntity | undefined;
    getVideo(videoId: string): IJsonVideo | undefined;
}
