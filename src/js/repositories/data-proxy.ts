/**
 * @todo Refactor (for now a big test class)
 */
import { IDataPage, IDataPageAudioEntity } from '@db/data-pages';
import { IAppDataConfig } from '@config/app-config';
import { IDataVideo, IDataVideoSource } from '@db/data-videos';
import { cloneDeep, orderBy } from 'lodash-es';

export type SupportedLangType = 'en' | 'fr';

export interface IDataProxyParams {
    defaultLang: SupportedLangType;
    baseUrl: {
        video: string;
        audio: string;
        videoCovers: string;
    };
}

export interface PageAudioEntityProps {
    src: string;
    tracks?: MediaTracks;
}

export interface PageEntityProps {
    pageId: string;
    title: string;
    sortIdx: number;
    name: string;
    keywords?: string[];
    videos: VideoEntity[];
    cover?: string;
    audio?: PageAudioEntityProps;
    audioTrack?: MediaTracks;
}

export interface VideoSourceProps {
    src: string;
    type?: string; // mimetype (i.e. video/mp4, video/webm)
    codecs?: string; // extra codec information (i.e. vp9)
    priority?: number;
}

export interface VideoMetaProps {
    duration?: number;
    width?: number;
    height?: number;
}

export interface MediaTracks {
    [key: string]: string;
}
export interface VideoEntityProps {
    videoId: string;
    sources: VideoSourceProps[];
    covers?: string[];
    meta?: VideoMetaProps;
    tracks?: MediaTracks;
}

export class VideoSourceEntity {
    public static fileTypes = {
        mp4: 'video/mp4',
        webm: 'video/webm',
    };

    constructor(protected readonly data: VideoSourceProps) {}

    get type(): string {
        if (this.data.type === undefined) {
            let fileExt = this.data.src.split('.').pop() as string;
            return VideoSourceEntity.fileTypes[fileExt] && `video/${fileExt}`;
        }
        return this.data.type;
    }

    get codecs(): string | undefined {
        return this.data.codecs;
    }

    get priority(): number {
        return this.data.priority || 0;
    }

    get src(): string {
        return this.data.src;
    }

    getHtmlTypeValue(): string {
        if (this.codecs !== undefined) {
            return `${this.type}; ${this.codecs}`;
        }
        return this.type;
    }

    static fromIDataVideoSource(dataVideoSource: IDataVideoSource): VideoSourceEntity {
        return new VideoSourceEntity({
            priority: dataVideoSource.priority,
            type: dataVideoSource.type,
            codecs: dataVideoSource.codecs,
            src: dataVideoSource.src,
        });
    }
}

export class VideoEntity {
    constructor(protected readonly data: VideoEntityProps) {}

    get videoId(): string {
        return this.data.videoId;
    }

    get sources(): VideoSourceProps[] {
        return this.data.sources;
    }

    get covers(): string[] | undefined {
        return this.data.covers;
    }

    get meta(): VideoMetaProps | undefined {
        return this.data.meta;
    }

    get duration(): number {
        if (this.meta === undefined || this.meta.duration === undefined) {
            return 0;
        }
        return this.meta.duration;
    }

    /**
     * Return formatted duration in hours:minutes:seconds
     * @returns {string}
     */
    getFormattedDuration(): string {
        const slices = {
            hours: Math.trunc(this.duration / 3600),
            minutes: Math.trunc(this.duration / 60),
            seconds: Math.round(this.duration % 60),
        };
        return `${slices.hours}:${slices.minutes}:${slices.seconds}`;
    }

    public getSources(sortByPriority: boolean = true): VideoSourceEntity[] {
        let data: VideoSourceProps[] = [];
        if (sortByPriority) {
            data = orderBy(this.data.sources, ['priority'], ['asc']);
        } else {
            data = this.data.sources;
        }
        return data.reduce(
            (accumulator, sourceProps): VideoSourceEntity[] => {
                accumulator.push(new VideoSourceEntity(sourceProps));
                return accumulator;
            },
            [] as VideoSourceEntity[]
        );
    }

    public static getFromIDataVideo(dataVideo: IDataVideo): VideoEntity {
        const sources = dataVideo.sources.reduce((accumulator: VideoSourceProps[], dataVideoSource) => {
            accumulator.push({
                priority: dataVideoSource.priority,
                type: dataVideoSource.type,
                codecs: dataVideoSource.codecs,
                src: dataVideoSource.src,
            });
            return accumulator;
        }, []);

        return new VideoEntity({
            videoId: dataVideo.video_id,
            sources: sources,
            tracks: dataVideo.tracks,
            covers: dataVideo.covers,
            meta: {
                duration: dataVideo.meta.duration,
                width: dataVideo.meta.width,
                height: dataVideo.meta.height,
            },
        });
    }
}

export class PageEntity {
    constructor(protected readonly data: PageEntityProps) {}

    get pageId(): string {
        return this.data.pageId;
    }

    get name(): string {
        return this.data.name;
    }

    get title(): string {
        return this.data.title;
    }

    get keywords(): string[] {
        return this.data.keywords || [];
    }

    get videos(): VideoEntity[] {
        return this.data.videos;
    }

    countVideos(): number {
        return this.data.videos.length;
    }

    hasAudio(): boolean {
        return this.data.audio !== undefined;
    }

    hasAudioTrack(): boolean {
        return this.data.audioTrack !== undefined;
    }

    getAudioTrack(): MediaTracks | undefined {
        if (!this.hasAudioTrack()) {
            return undefined;
        }
        return this.data.audioTrack;
    }
    getAudio(): PageAudioEntityProps | undefined {
        return this.data.audio;
    }
}

export default class DataProxy {
    public readonly props: IDataProxyParams;
    protected readonly data: IAppDataConfig;
    protected readonly fallbackLang = 'en';

    constructor(data: IAppDataConfig, props: IDataProxyParams) {
        this.props = props;
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
        const { video: videoBaseUrl, videoCovers: videoCoversUrl } = this.props.baseUrl;
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
     * Return localized page with medias
     *
     * @param {string} pageId
     * @param {string} lang
     * @returns {Promise<PageEntityProps>}
     */
    async getPageEntity(pageId: string, lang: SupportedLangType): Promise<PageEntity> {
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

        //keywords: pageData.keywords[lang],
        //cover: pageData.cover,

        return new Promise<PageEntity>((resolve, reject) => {
            resolve(new PageEntity(pageEntityProps));
        });
    }
}
