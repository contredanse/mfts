import { IAppDataConfig } from '@config/app-config';
import { IJsonVideo } from '@data/json/data-videos';
import { IJsonPage } from '@data/json/data-pages';
import { cloneDeep } from 'lodash-es';
import { IDataRepository, DataSupportedLangType, IDataRepositoryParams } from '@model/repository/data-repository';
import VideoEntity from '@model/entity/video-entity';
import PageEntity, { MediaTracks, IPageEntityData } from '@model/entity/page-entity';
import VideoSourceEntity from '@model/entity/video-source-entity';

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
    async getPage(pageId: string): Promise<IJsonPage> {
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

    getPage2(pageId: string): IJsonPage | undefined {
        const page = this.data.pages.find((element: IJsonPage) => {
            return pageId === element.page_id;
        });
        return page;
    }

    async getVideo(id: string): Promise<IJsonVideo> {
        return new Promise<IJsonVideo>((resolve, reject) => {
            const video = cloneDeep(
                this.data.videos.find((element: IJsonVideo) => {
                    return id === element.video_id;
                })
            );
            if (video === undefined) {
                reject(`Video '${id}' cannot be found`);
            }
            resolve(video);
        });
    }

    /**
     * Return localized video entity
     *
     * @param {string} videoId
     * @returns {Promise<VideoEntity>}
     */
    async getVideoEntity(videoId: string): Promise<VideoEntity> {
        const { video: videoBaseUrl, videoCovers: videoCoversUrl } = this.params.urlPaths;
        const video = await this.getVideo(videoId);

        // Convert and add urlPaths video sources
        const sources = video.sources.reduce(
            (acc, rawSource) => {
                acc.push(
                    new VideoSourceEntity({
                        src: `${videoBaseUrl}/${rawSource.src}`,
                        type: rawSource.type,
                        codecs: rawSource.codecs,
                        priority: rawSource.priority,
                    })
                );
                return acc;
            },
            [] as VideoSourceEntity[]
        );

        // Convert and add urlPaths to tracks
        let tracks;
        if (video.tracks !== undefined) {
            tracks = {} as MediaTracks;
            for (const lang in video.tracks) {
                tracks[lang] = `${videoBaseUrl}/${video.tracks[lang]}`;
            }
        }

        // Convert and add urlPaths to covers
        let covers: string[] | undefined;
        if (video.covers !== undefined) {
            covers = video.covers.reduce((acc: string[], cover) => {
                acc.push(`${videoCoversUrl}/${cover}`);
                return acc;
            }, []);
        }

        const meta = video.meta;

        return new Promise<VideoEntity>((resolve, reject) => {
            const videoEntity = new VideoEntity({
                videoId: video.video_id,
                sources: sources,
                covers: covers,
                tracks: tracks,
                meta: meta,
            });
            resolve(videoEntity);
        });
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

    /**
     * Return localized PageEntity
     *
     * @param {string} pageId
     * @param {string} lang
     * @returns {Promise<IPageEntityData>}
     */
    async getPageEntity(pageId: string, lang: DataSupportedLangType): Promise<PageEntity> {
        const pageData = await this.getPage(pageId);
        const { content } = pageData;

        const videos: VideoEntity[] = [];

        for (const videoContent of content.videos) {
            const { video_id: i18nVideoId, muted, loop, video_detail: videoDetail } = videoContent;
            const videoId = i18nVideoId[lang] || i18nVideoId[this.fallbackLang];
            const video = await this.getVideoEntity(videoId);
            videos.push(video);
        }

        // get localized audio versions
        /*
        let audio: PageAudioEntityProps | undefined;
        if (content.audio !== undefined) {
            const { tracks, src: i18nAudioSrc } = content.audio;
            const src = i18nAudioSrc[lang] || i18nAudioSrc[this.fallbackLang];

            audio = {
                src: src,
            };
            if (tracks !== undefined) {
                audio.tracks = tracks;
            }
        }*/
        const audio = content.audio;

        const pageEntityProps: IPageEntityData = {
            pageId: pageData.page_id,
            title: pageData.title[lang],
            sortIdx: pageData.sort_idx,
            name: pageData.name[lang],
            videos: videos,
            cover: pageData.cover,
            keywords: pageData.keywords[lang] || pageData.keywords[this.fallbackLang],
            audio: audio,
        };

        // TODO
        //keywords: pageData.keywords[lang],
        //cover: pageData.cover,

        return new Promise<PageEntity>((resolve, reject) => {
            resolve(
                new PageEntity(pageEntityProps, {
                    lang: lang,
                    fallbackLang: 'en',
                    baseUrl: this.params.assetsBaseUrl,
                })
            );
        });
    }
}
