import { orderBy } from 'lodash-es';
import VideoSourceEntity, { VideoSourceEntityFactory, IVideoSourceEntityData } from '@model/entity/video-source-entity';
import { AbstractBaseEntity, IBaseEntityOptions } from '@model/entity/abstract-base-entity';
import { IJsonVideo, IJsonVideoMeta, IJsonVideoSource, IJsonVideoTracks } from '@data/json/data-videos';

export class VideoEntityFactory {
    static createFromJson(data: IJsonVideo, options?: VideoEntityOptions): VideoEntity {
        return new VideoEntity(data, options);
    }
}

export interface VideoMetaProps {
    duration?: number;
    width?: number;
    height?: number;
}

export interface VideoEntityProps extends IJsonVideo {}

export interface VideoEntityOptions extends IBaseEntityOptions {}

export default class VideoEntity extends AbstractBaseEntity {
    readonly options!: VideoEntityOptions;

    constructor(protected readonly data: VideoEntityProps, options?: VideoEntityOptions) {
        super(options);
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

    getFirstCover(baseUrl?: string): string | undefined {
        if (!this.hasCover()) {
            return undefined;
        }
        return this.getHelper().addBaseUrl((this.covers as string[])[0], baseUrl);
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

    getSources(sortByPriority: boolean = true): VideoSourceEntity[] {
        let data: IVideoSourceEntityData[] = [];
        if (sortByPriority) {
            data = orderBy(this.data.sources, ['priority'], ['asc']);
        } else {
            data = this.data.sources;
        }
        return data.reduce(
            (accumulator, jsonSource): VideoSourceEntity[] => {
                accumulator.push(VideoSourceEntityFactory.createFromJson(jsonSource, this.options));
                return accumulator;
            },
            [] as VideoSourceEntity[]
        );
    }
}
