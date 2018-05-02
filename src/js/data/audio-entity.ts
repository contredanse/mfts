import { MediaTracks } from '@src/data/page-entity';
import { IDataPageAudio, LocalizedAudioSource } from '@db/data-pages';
import { BaseEntity, IBaseEntityOptions } from '@src/data/base-entity';

export class AudioEntityFactory {
    static createFromData(data: IDataPageAudio, options?: AudioEntityOptions): AudioEntity {
        return new AudioEntity(
            {
                src: data.src,
                tracks: data.tracks,
            },
            options
        );
    }
}

export interface AudioEntityProps {
    src: LocalizedAudioSource;
    tracks?: MediaTracks;
}

export interface AudioEntityOptions extends IBaseEntityOptions {}

export default class AudioEntity extends BaseEntity {
    readonly options!: AudioEntityOptions;

    constructor(protected readonly data: AudioEntityProps, options?: AudioEntityOptions) {
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
}
