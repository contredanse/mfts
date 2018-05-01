import { IAppDataConfig } from '@config/app-config';
import { IDataVideo } from '@db/data-videos';
import { IDataPage } from '@db/data-pages';
import { cloneDeep } from 'lodash-es';
import { IDataRepository, DataSupportedLangType, IDataRepositoryParams } from '@src/data/data-repository';
import VideoEntity, { VideoSourceEntity } from '@src/data/video-entity';
import PageEntity, { MediaTracks, PageAudioEntityProps, PageEntityProps } from '@src/data/page-entity';

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
     * @returns {Promise<IDataPage>}
     */
    async getPage(pageId: string): Promise<IDataPage> {
        return new Promise<IDataPage>((resolve, reject) => {
            const page = this.data.pages.find((element: IDataPage) => {
                return pageId === element.page_id;
            });
            if (page === undefined) {
                reject(`Page '${pageId}' cannot be found`);
            }
            resolve(page);
        });
    }

    async getVideo(id: string): Promise<IDataVideo> {
        return new Promise<IDataVideo>((resolve, reject) => {
            const video = cloneDeep(
                this.data.videos.find((element: IDataVideo) => {
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
        const { video: videoBaseUrl, videoCovers: videoCoversUrl } = this.params.baseUrl;
        const video = await this.getVideo(videoId);

        // Convert and add baseUrl video sources
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

        // Convert and add baseUrl to tracks
        let tracks;
        if (video.tracks !== undefined) {
            tracks = {} as MediaTracks;
            for (let lang in video.tracks) {
                tracks[lang] = `${videoBaseUrl}/${video.tracks[lang]}`;
            }
        }

        // Convert and add baseUrl to covers
        let covers: string[] | undefined;
        if (video.covers !== undefined) {
            covers = video.covers.reduce((acc: string[], cover) => {
                acc.push(`${videoCoversUrl}/${cover}`);
                return acc;
            }, []);
        }

        let meta = video.meta;

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

    /**
     * Return localized PageEntity
     *
     * @param {string} pageId
     * @param {string} lang
     * @returns {Promise<PageEntityProps>}
     */
    async getPageEntity(pageId: string, lang: DataSupportedLangType): Promise<PageEntity> {
        const pageData = await this.getPage(pageId);
        const { content } = pageData;

        const videos: VideoEntity[] = [];

        for (let videoContent of content.videos) {
            const { video_id: i18nVideoId, muted, loop, video_detail: videoDetail } = videoContent;
            const videoId = i18nVideoId[lang] || i18nVideoId[this.fallbackLang];
            const video = await this.getVideoEntity(videoId);
            videos.push(video);
        }

        // get localized audio versions
        let audio: PageAudioEntityProps | undefined;
        if (content.audio !== undefined) {
            const { tracks, src: i18nAudioSrc } = content.audio;
            let src = i18nAudioSrc[lang] || i18nAudioSrc[this.fallbackLang];

            audio = {
                src: src,
            };
            if (tracks !== undefined) {
                audio.tracks = tracks;
            }
        }

        const pageEntityProps: PageEntityProps = {
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
            resolve(new PageEntity(pageEntityProps));
        });
    }
}
