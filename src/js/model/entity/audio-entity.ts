import { IJsonPageAudio, IJsonPageAudioTrack, IJsonLocalizedAudioSource } from 'src/data/json/data-pages';
import { AbstractBaseEntity, IBaseEntityOptions } from '@model/entity/abstract-base-entity';

export class AudioEntityFactory {
    static createFromJson(data: IJsonPageAudio, options?: AudioEntityOptions): AudioEntity {
        return new AudioEntity(
            {
                src: data.src,
                tracks: data.tracks,
            },
            options
        );
    }
}

export interface IAudioEntityData {
    src: IJsonLocalizedAudioSource;
    tracks?: IJsonPageAudioTrack[];
}

export interface AudioEntityOptions extends IBaseEntityOptions {}

export default class AudioEntity extends AbstractBaseEntity {
    readonly options!: AudioEntityOptions;

    constructor(protected readonly data: IAudioEntityData, options?: AudioEntityOptions) {
        super(options);
    }

    /**
     * Return audio source file
     *
     * @param {string} lang
     * @param {string} baseUrl
     * @returns {string}
     */
    getSrc(lang?: string, baseUrl?: string): string {
        lang = lang === undefined ? this.options.fallbackLang : lang;
        baseUrl = baseUrl || this.options.baseUrl;
        return [baseUrl, this.data.src[lang]].join('/');
    }

    hasTracks(): boolean {
        return this.data.tracks !== undefined;
    }

    getAllTracks(baseUrl?: string): IJsonPageAudioTrack[] {
        if (!this.hasTracks()) {
            return [];
        }
        baseUrl = baseUrl || this.options.baseUrl;
        const tracks: IJsonPageAudioTrack[] = [];
        for (const audioTrack of this.data.tracks as IJsonPageAudioTrack[]) {
            tracks.push({
                lang: audioTrack.lang,
                src: `${baseUrl}/${audioTrack.src}`,
            });
        }

        return tracks;
    }
}
