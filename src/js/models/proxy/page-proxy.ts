import VideoEntity from '../entity/video-entity';
import AudioProxy, { AudioProxyFactory } from '../proxy/audio-proxy';
import { AbstractBaseEntity, IBaseEntityOptions } from '../entity/abstract-base-entity';
import { IJsonPage, IJsonPageAudio, IJsonPageVideo } from '../../../data/json/data-pages';
import VideoRepository from '../repository/video-repository';

export class PageProxyFactory {
    static createFromJson(data: IJsonPage, repository: VideoRepository, options: IPageEntityOptions): PageProxy {
        return new PageProxy(data, repository, options);
    }
}

export interface IPageEntityData extends IJsonPage {}

export interface IPageEntityOptions extends IBaseEntityOptions {}

export default class PageProxy extends AbstractBaseEntity {
    protected readonly data: IPageEntityData;
    protected readonly repository: VideoRepository;

    constructor(data: IPageEntityData, repository: VideoRepository, options: IPageEntityOptions) {
        super(options);
        this.data = data;
        // TO do remove this and use IoC container when time
        this.repository = repository;
    }

    get pageId(): string {
        return this.data.page_id;
    }

    get videos(): IJsonPageVideo[] {
        return this.data.content.videos || [];
    }

    getTitle(lang?: string): string {
        return this.getHelper().getLocalizedValue(this.data.title, lang) || '';
    }

    getKeywords(lang?: string): string[] {
        return this.getHelper().getLocalizedValue(this.data.keywords) || [];
    }

    countVideos(): number {
        return this.data.content.videos.length || 0;
    }

    /**
     * Whether the page contains only one regular video (image+sound)
     * or multiple videos/audio that we need to compose at the UI level
     */
    isMultiLayout(): boolean {
        return this.countVideos() > 1 || this.getAudioProxy() !== undefined;
    }

    getFirstVideo(lang?: string): VideoEntity | undefined {
        const firstVideo = this.getHelper().getLocalizedValue(this.videos[0].lang_video_id, lang);
        if (firstVideo === undefined) {
            return undefined;
        }
        return this.repository.getVideoEntity(firstVideo);
    }

    getVideos(lang?: string): VideoEntity[] {
        if (this.countVideos() === 0) {
            return [];
        }
        const videos: VideoEntity[] = [];
        this.videos.forEach(({ lang_video_id, video_detail }) => {
            const videoId = this.getHelper().getLocalizedValue<string>(lang_video_id, lang);
            if (videoId !== undefined) {
                const videoEntity = this.repository.getVideoEntity(videoId);
                if (videoEntity !== undefined) {
                    if (video_detail) {
                        const videoDetailId = this.getHelper().getLocalizedValue<string>(
                            video_detail.lang_video_id,
                            lang
                        );
                        if (videoDetailId) {
                            const videoDetailEntity = this.repository.getVideoEntity(videoDetailId);
                            videoEntity.videoLink = videoDetailEntity || null;
                        }
                    }
                    videos.push(videoEntity);
                } else {
                    console.warn(`Missing video ${videoId}`);
                }
            }
        });
        return videos;
    }

    hasAudio(): boolean {
        return this.data.content.audio !== undefined;
    }

    getAudioProxy(): AudioProxy | undefined {
        if (!this.hasAudio()) {
            return undefined;
        }
        return AudioProxyFactory.createFromJson(this.data.content.audio as IJsonPageAudio, this.options);
    }
}
