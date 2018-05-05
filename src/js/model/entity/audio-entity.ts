import { IJsonPageAudio, IJsonPageAudioTrack } from '@data/json/data-pages';
import { AbstractBaseEntity, IBaseEntityOptions } from '@src/model/entity/abstract-base-entity';

export class AudioEntityFactory {
    static createFromJson(data: IJsonPageAudio, options: IAudioEntityOptions): AudioEntity {
        return new AudioEntity(data, options);
    }
}

export interface IAudioEntityData extends IJsonPageAudio {}

export interface IAudioEntityOptions extends IBaseEntityOptions {}

export default class AudioEntity extends AbstractBaseEntity {
    readonly options!: IAudioEntityOptions;

    constructor(protected readonly data: IAudioEntityData, options: IAudioEntityOptions) {
        super(options);
    }

    getSourceFile(lang?: string, baseUrl?: string): string | undefined {
        const sourceFile = this.getHelper().getLocalizedValue<string>(this.data.src, lang);
        if (!sourceFile) {
            return undefined;
        }
        return this.getHelper().addBaseUrl(sourceFile, baseUrl);
    }

    hasTrack(): boolean {
        return this.data.tracks !== undefined;
    }

    getAllTracks(baseUrl?: string): IJsonPageAudioTrack[] {
        if (!this.hasTrack()) {
            return [];
        }
        const tracks: IJsonPageAudioTrack[] = [];
        for (const audioTrack of this.data.tracks as IJsonPageAudioTrack[]) {
            tracks.push({
                lang: audioTrack.lang,
                src: this.getHelper().addBaseUrl(audioTrack.src, baseUrl),
            });
        }
        return tracks;
    }
}
