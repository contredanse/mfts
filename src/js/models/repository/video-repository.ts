import AppConfig from '@src/core/app-config';
import { IJsonVideo } from '@data/json/data-videos';
import VideoProxy, { VideoProxyFactory } from '@src/models/proxy/video-proxy';

export default class VideoRepository {
    protected readonly videos: IJsonVideo[];
    protected readonly config: AppConfig;

    constructor(config: AppConfig, videos: IJsonVideo[]) {
        this.videos = videos;
        this.config = config;
    }

    getVideo(videoId: string): IJsonVideo | undefined {
        return (
            this.videos.find((element: IJsonVideo) => {
                return videoId === element.video_id;
            }) || undefined
        );
    }

    getVideoProxy(videoId: string): VideoProxy | undefined {
        const jsonVideo = this.getVideo(videoId);
        if (jsonVideo === undefined) {
            return undefined;
        }
        return VideoProxyFactory.createFromJson(jsonVideo, {
            fallbackLang: this.config.fallbackLang,
            assetsLocator: this.config.assetsLocator,
        });
    }
}
