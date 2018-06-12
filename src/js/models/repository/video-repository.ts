import AppConfig from '@src/core/app-config';
import { IJsonVideo } from '@data/json/data-videos';
import VideoEntity, { VideoEntityFactory } from '@src/models/entity/video-entity';

export default class VideoRepository {
    protected readonly videos: IJsonVideo[];
    protected readonly config: AppConfig;

    constructor(config: AppConfig) {
        this.videos = config.getAppData().videos;
        this.config = config;
    }

    getVideo(videoId: string): IJsonVideo | null {
        const video =
            this.videos.find((element: IJsonVideo) => {
                return videoId === element.video_id;
            }) || null;
        return video;
    }

    getVideoEntity(videoId: string): VideoEntity | null {
        const jsonVideo = this.getVideo(videoId);
        if (jsonVideo === null) {
            return null;
        }
        return VideoEntityFactory.createFromJson(jsonVideo, {
            fallbackLang: this.config.fallbackLang,
            assetsLocator: this.config.assetsLocator,
        });
    }
}
