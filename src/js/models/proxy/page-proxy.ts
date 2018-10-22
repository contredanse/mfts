import VideoProxy from '../proxy/video-proxy';
import AudioProxy, { AudioProxyFactory } from '../proxy/audio-proxy';
import { AbstractBaseProxy, IBaseProxyOptions } from './abstract-base-proxy';
import { IJsonPage, IJsonPageAudio, IJsonPageVideo } from '../../../data/json/data-pages';
import VideoRepository from '../repository/video-repository';

export class PageProxyFactory {
    static createFromJson(data: IJsonPage, repository: VideoRepository, options: IPageEntityOptions): PageProxy {
        return new PageProxy(data, repository, options);
    }
}

export interface IPageEntityData extends IJsonPage {}

export interface IPageEntityOptions extends IBaseProxyOptions {}

export default class PageProxy extends AbstractBaseProxy {
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
    isMultiVideoContent(): boolean {
        return this.countVideos() > 1 || this.hasAudio();
    }

    isSingleVideoContent(): boolean {
        return this.countVideos() === 1;
    }

    /**
     * Wheter the content has associated sound track or not.
     * Return false if cannot determine from video metadatas
     */
    isSilent(): boolean {
        if (this.countVideos() === 1) {
            try {
                return !this.getFirstVideo()!.hasAudio;
            } catch (e) {
                return false;
            }
        } else {
            // Multi content
            return !this.hasAudio();
        }
    }

    /**
     * Whether the content must have real player controls
     */
    hasMainPlayer(): boolean {
        return !this.isMultiVideoContent() || this.hasAudio();
    }

    getDuration(lang?: string): number | undefined {
        if (this.isSingleVideoContent()) {
            const firstVideo = this.repository.getVideo(
                this.getHelper().getLocalizedValue<string>(this.videos[0].lang_video_id, lang)!
            );
            if (firstVideo && firstVideo.meta && firstVideo.meta.duration) {
                return firstVideo.meta.duration;
            }
        } else if (this.hasAudio()) {
            // We actually don't know
            return undefined;
        }
        return undefined;
    }

    isAutoloop(): boolean {
        return this.data.loop === true && !this.data.loop_number;
    }

    getNumberOfLoopIterations(): number | undefined {
        return this.data.loop_number;
    }

    shouldHaveSpeedControls(): boolean {
        return this.data.speed_control === true || this.isSilent() || this.isMultiVideoContent();
    }

    getFirstVideo(lang?: string): VideoProxy | undefined {
        const firstVideo = this.getHelper().getLocalizedValue<string>(this.videos[0].lang_video_id, lang)!;

        if (firstVideo === undefined) {
            return undefined;
        }
        return this.repository.getVideoProxy(firstVideo);
    }

    getVideos(lang?: string): VideoProxy[] {
        if (this.countVideos() === 0) {
            return [];
        }
        const videos: VideoProxy[] = [];
        this.videos.forEach(({ lang_video_id, video_detail }) => {
            const videoId = this.getHelper().getLocalizedValue<string>(lang_video_id, lang);
            if (videoId !== undefined) {
                const videoProxy = this.repository.getVideoProxy(videoId);
                if (videoProxy !== undefined) {
                    if (video_detail) {
                        const videoDetailId = this.getHelper().getLocalizedValue<string>(
                            video_detail.lang_video_id,
                            lang
                        );
                        if (videoDetailId) {
                            const videoDetailEntity = this.repository.getVideoProxy(videoDetailId);
                            videoProxy.videoLink = videoDetailEntity || null;
                        }
                    }
                    videos.push(videoProxy);
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
