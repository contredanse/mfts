import { IJsonPageAudio, IJsonPageAudioTrack } from '../../../data/json/data-pages';
import { AbstractBaseEntity, IBaseEntityOptions } from '../entity/abstract-base-entity';

export class AudioProxyFactory {
    static createFromJson(data: IJsonPageAudio, options: IAudioProxyOptions): AudioProxy {
        return new AudioProxy(data, options);
    }
}

export interface IAudioProxyData extends IJsonPageAudio {}

export interface IAudioProxyOptions extends IBaseEntityOptions {}

export default class AudioProxy extends AbstractBaseEntity {
    readonly options!: IAudioProxyOptions;

    protected readonly data: IAudioProxyData;

    constructor(data: IAudioProxyData, options: IAudioProxyOptions) {
        super(options);
        this.data = data;
    }

    getSourceFile(lang?: string, baseUrl?: string): string | undefined {
        const sourceFile = this.getHelper().getLocalizedValue<string>(this.data.src, lang);
        if (!sourceFile) {
            return undefined;
        }

        const src = baseUrl
            ? this.getHelper().addBaseUrl(sourceFile, baseUrl)
            : this.getHelper().getAssetUrl(sourceFile, 'audios');

        return src;
    }

    hasTrack(): boolean {
        return this.data.tracks !== undefined && this.data.tracks.length > 0;
    }

    getAllTracks(baseUrl?: string): IJsonPageAudioTrack[] {
        if (!this.hasTrack()) {
            return [];
        }
        const tracks: IJsonPageAudioTrack[] = [];
        for (const audioTrack of this.data.tracks as IJsonPageAudioTrack[]) {
            const src = baseUrl
                ? this.getHelper().addBaseUrl(audioTrack.src, baseUrl)
                : this.getHelper().getAssetUrl(audioTrack.src, 'audioSubs');

            tracks.push({
                lang: audioTrack.lang,
                src: src,
            });
        }
        return tracks;
    }
}
