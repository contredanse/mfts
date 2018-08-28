import AppConfig from '@src/core/app-config';
import { IJsonVideo } from '@data/json/data-videos';
import VideoEntity, { VideoEntityFactory } from '@src/models/entity/video-entity';

export default class VideoRepository {
    protected readonly videos: IJsonVideo[];
    protected readonly config: AppConfig;

    constructor(config: AppConfig, videos: IJsonVideo[]) {
        this.videos = videos;
        this.config = config;
    }

    getVideo(videoId: string): IJsonVideo | undefined {
        const video =
            this.videos.find((element: IJsonVideo) => {
                return videoId === element.video_id;
            }) || undefined;
        return video;
    }

    getVideoEntity(videoId: string): VideoEntity | undefined {
        const jsonVideo = this.getVideo(videoId);
        if (jsonVideo === undefined) {
            return undefined;
        }
        return VideoEntityFactory.createFromJson(jsonVideo, {
            fallbackLang: this.config.fallbackLang,
            assetsLocator: this.config.assetsLocator,
        });
    }
}
