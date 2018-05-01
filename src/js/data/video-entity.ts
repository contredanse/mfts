import { orderBy } from 'lodash-es';
import { IDataVideo, IDataVideoSource } from '@db/data-videos';
import { MediaTracks } from '@src/data/page-entity';

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
