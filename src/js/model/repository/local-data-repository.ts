import { IAppDataConfig } from '@config/app-config';
import { IJsonVideo } from '@data/json/data-videos';
import { IJsonPage, IJsonPageContent, IJsonPageLocalizedKeywords, IJsonPageLocalizedText } from '@data/json/data-pages';
import { cloneDeep } from 'lodash-es';
import { IDataRepository, DataSupportedLangType, IDataRepositoryParams } from '@model/repository/data-repository';
import VideoEntity, { VideoEntityFactory } from '@model/entity/video-entity';
import PageEntity, { MediaTracks, IPageEntityData, PageEntityFactory } from '@model/entity/page-entity';

export default class LocalDataRepository implements IDataRepository {
    public readonly params: IDataRepositoryParams;
    protected readonly data: IAppDataConfig;
    protected readonly fallbackLang = 'en';

    constructor(data: IAppDataConfig, params: IDataRepositoryParams) {
        this.params = params;
        this.data = data;
    }

    /**
     * Get raw page information
     * @param {string} pageId
     * @returns {Promise<IJsonPage>}
     */
    async getAsyncPage(pageId: string): Promise<IJsonPage> {
        return new Promise<IJsonPage>((resolve, reject) => {
            const page = this.data.pages.find((element: IJsonPage) => {
                return pageId === element.page_id;
            });
            if (page === undefined) {
                reject(`Page '${pageId}' cannot be found`);
            }
            resolve(page);
        });
    }

    getVideo(videoId: string): IJsonVideo | undefined {
        const video = this.data.videos.find((element: IJsonVideo) => {
            return videoId === element.video_id;
        });
        return video;
    }

    getVideoEntity(videoId: string): VideoEntity | undefined {
        const jsonVideo = this.getVideo(videoId);
        if (jsonVideo === undefined) {
            return undefined;
        }
        return VideoEntityFactory.createFromJson(jsonVideo);
    }

    getAllPages(): IJsonPage[] {
        return this.data.pages;
    }

    findPages(fragment: string, lang: DataSupportedLangType): IJsonPage[] {
        if (fragment === '') {
            return this.getAllPages();
        }
        const regex = new RegExp(fragment, 'i');
        const results = this.data.pages.filter((page: IJsonPage, idx: number) => {
            const keywords = page.keywords[lang] || page.keywords[this.fallbackLang];
            if (keywords !== undefined) {
                return (
                    keywords
                        .join(' ')
                        .concat(page.title[lang])
                        .concat(page.content.layout)
                        .search(regex) > -1
                );
            }
            return false;
        });

        return results;
    }

    getPage(pageId: string): IJsonPage | undefined {
        const page = this.data.pages.find((element: IJsonPage) => {
            return pageId === element.page_id;
        });
        return page;
    }

    /**
     * Return page entity
     *
     * @param {string} pageId
     * @returns {PageEntity | undefined}
     */
    getPageEntity(pageId: string): PageEntity | undefined {
        const page = this.getPage(pageId);
        if (page === undefined) {
            return undefined;
        }

        // TODO CLEAR UP OPTIONS
        const pageEntity = PageEntityFactory.createFromJson(page, this, {
            lang: 'en',
            fallbackLang: this.fallbackLang,
            baseUrl: this.params.assetsBaseUrl.audio,
        });
        return pageEntity;
    }
}
