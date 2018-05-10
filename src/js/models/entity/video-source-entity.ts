import { AbstractBaseEntity, IBaseEntityOptions } from '@src/model/entity/abstract-base-entity';
import { IJsonVideoSource } from '@data/json/data-videos';

export class VideoSourceEntityFactory {
    static createFromJson(data: IJsonVideoSource, options: IVideoSourceEntityOptions): VideoSourceEntity {
        return new VideoSourceEntity(data, options);
    }
}

export interface IVideoSourceEntityData extends IJsonVideoSource {}

export interface IVideoSourceEntityOptions extends IBaseEntityOptions {}

export default class VideoSourceEntity extends AbstractBaseEntity {
    /**
     * Mimetypes map for some media formats
     * @type {{mp4: string; webm: string; av1: string; mp3: string}}
     */
    static fileTypes = {
        mp4: 'video/mp4',
        webm: 'video/webm',
        av1: 'video/av1',
        mp3: 'audio/mpeg',
    };

    readonly options!: IVideoSourceEntityOptions;

    constructor(protected readonly data: IVideoSourceEntityData, options: IVideoSourceEntityOptions) {
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

    getSource(baseUrl?: string): string {
        baseUrl = baseUrl || this.options.assetsLocator.getMediaTypeBaseUrl('videos');
        return this.getHelper().addBaseUrl(this.src, baseUrl);
    }

    getHtmlVideoTypeValue(): string {
        if (this.codecs !== undefined) {
            return `${this.type}; ${this.codecs}`;
        }
        return this.type;
    }
}
