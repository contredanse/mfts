import { orderBy } from 'lodash-es';
import VideoSourceProxy, { VideoSourceProxyFactory, IVideoSourceProxyData } from './video-source-proxy';
import { AbstractBaseProxy, IBaseProxyOptions } from './abstract-base-proxy';
import { IJsonVideo, IJsonVideoMeta, IJsonVideoSource, IJsonVideoTrack } from '../../../data/json/data-videos';
import { IJsonPageAudioTrack } from '../../../data/json/data-pages';

export class VideoProxyFactory {
    static createFromJson(data: IJsonVideo, options: IVideoProxyOptions): VideoProxy {
        return new VideoProxy(data, options);
    }
}

export interface IVideoProxyData extends IJsonVideo {}

export interface IVideoProxyOptions extends IBaseProxyOptions {}

export default class VideoProxy extends AbstractBaseProxy {
    readonly options!: IVideoProxyOptions;
    protected links: {
        video: VideoProxy | null;
    };

    protected readonly data: IVideoProxyData;

    constructor(data: IVideoProxyData, options: IVideoProxyOptions) {
        super(options);
        this.links = { video: null };
        this.data = data;
    }

    set videoLink(videoLink: VideoProxy | null) {
        this.links.video = videoLink;
    }

    get videoLink(): VideoProxy | null {
        return this.links.video;
    }

    get videoId(): string {
        return this.data.video_id;
    }

    get sources(): IJsonVideoSource[] {
        return this.data.sources;
    }

    get covers(): string[] | undefined {
        return this.data.covers;
    }

    get meta(): IJsonVideoMeta | undefined {
        return this.data.meta;
    }

    get duration(): number {
        if (this.meta === undefined || this.meta.duration === undefined) {
            return 0;
        }
        return this.meta.duration;
    }

    hasCover(): boolean {
        return this.covers !== undefined && this.covers.length !== 0;
    }

    hasVideoLink(): boolean {
        return this.links.video !== null;
    }

    getFirstCover(baseUrl?: string): string | undefined {
        if (!this.hasCover()) {
            return undefined;
        }
        const src = baseUrl
            ? this.getHelper().addBaseUrl(this.covers![0], baseUrl)
            : this.getHelper().getAssetUrl(this.covers![0], 'videoCovers');

        return src;
    }

    /**
     * Return formatted duration in hours:minutes:seconds
     * @returns {string}
     */
    getFormattedDuration(): string {
        const slices = {
            hours: Math.trunc(this.duration / 3600)
                .toString()
                .padStart(2, '0'),
            minutes: Math.trunc(this.duration / 60)
                .toString()
                .padStart(2, '0'),
            seconds: Math.round(this.duration % 60)
                .toString()
                .padStart(2, '0'),
        };
        return `${slices.hours}:${slices.minutes}:${slices.seconds}`;
    }

    getSources(sortByPriority: boolean = true): VideoSourceProxy[] {
        let data: IVideoSourceProxyData[] = [];
        if (sortByPriority) {
            data = orderBy(this.data.sources, ['priority'], ['asc']);
        } else {
            data = this.data.sources;
        }
        return data.reduce(
            (accumulator, jsonSource): VideoSourceProxy[] => {
                accumulator.push(VideoSourceProxyFactory.createFromJson(jsonSource, this.options));
                return accumulator;
            },
            [] as VideoSourceProxy[]
        );
    }

    hasTrack(): boolean {
        return this.data.tracks !== undefined && this.data.tracks.length > 0;
    }

    getAllTracks(baseUrl?: string): IJsonVideoTrack[] {
        if (!this.hasTrack()) {
            return [];
        }
        const tracks: IJsonPageAudioTrack[] = [];
        for (const videoTrack of this.data.tracks as IJsonVideoTrack[]) {
            const src = baseUrl
                ? this.getHelper().addBaseUrl(videoTrack.src, baseUrl)
                : this.getHelper().getAssetUrl(videoTrack.src, 'videoSubs');

            tracks.push({
                lang: videoTrack.lang,
                src: src,
            });
        }
        return tracks;
    }
}
