import { AbstractBaseProxy, IBaseProxyOptions } from './abstract-base-proxy';
import { IJsonVideoSource } from '../../../data/json/data-videos';

export class VideoSourceProxyFactory {
    static createFromJson(data: IJsonVideoSource, options: IVideoSourceProxyOptions): VideoSourceProxy {
        return new VideoSourceProxy(data, options);
    }
}

export interface IVideoSourceProxyData extends IJsonVideoSource {}

export interface IVideoSourceProxyOptions extends IBaseProxyOptions {}

export default class VideoSourceProxy extends AbstractBaseProxy {
    /**
     * Mimetypes map for some media formats
     * @type {{mp4: string; webm: string; av1: string; mp3: string}}
     */
    static fileTypes: { [key: string]: string } = {
        mp4: 'video/mp4',
        webm: 'video/webm',
        av1: 'video/av1',
        mp3: 'audio/mpeg',
    };

    readonly options!: IVideoSourceProxyOptions;

    protected readonly data: IVideoSourceProxyData;

    constructor(data: IVideoSourceProxyData, options: IVideoSourceProxyOptions) {
        super(options);
        this.data = data;
    }

    get type(): string {
        if (this.data.type === undefined) {
            const fileExt = this.data.src.split('.').pop() as string;
            return VideoSourceProxy.fileTypes[fileExt] && `video/${fileExt}`;
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
