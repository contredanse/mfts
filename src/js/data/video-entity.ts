import { orderBy } from 'lodash-es';
import { MediaTracks } from '@src/data/page-entity';
import VideoSourceEntity, { VideoSourceProps } from '@src/data/video-source-entity';

export interface VideoMetaProps {
    duration?: number;
    width?: number;
    height?: number;
}

export interface VideoEntityProps {
    videoId: string;
    sources: VideoSourceProps[];
    covers?: string[];
    meta?: VideoMetaProps;
    tracks?: MediaTracks;
}

export default class VideoEntity {
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

    getSources(sortByPriority: boolean = true): VideoSourceEntity[] {
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
}
