import { BaseEntity, IBaseEntityOptions } from '@model/base-entity';
import { VideoEntityProps } from '@model/video-entity';

export class VideoSourceEntityFactory {
    static createFromJson(data: any, options?: VideoSourceEntityOptions): VideoSourceEntity {
        return new VideoSourceEntity({} as any, options);
    }
}

export interface VideoSourceProps {
    src: string;
    type?: string; // mimetype (i.e. video/mp4, video/webm)
    codecs?: string; // extra codec information (i.e. vp9)
    priority?: number;
}

export interface VideoSourceEntityOptions extends IBaseEntityOptions {}

export default class VideoSourceEntity extends BaseEntity {
    static fileTypes = {
        mp4: 'video/mp4',
        webm: 'video/webm',
    };

    readonly options!: VideoSourceEntityOptions;

    constructor(protected readonly data: VideoSourceProps, options?: VideoSourceEntityOptions) {
        super(options);
    }

    get type(): string {
        if (this.data.type === undefined) {
            const fileExt = this.data.src.split('.').pop() as string;
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
}
