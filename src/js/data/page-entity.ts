import VideoEntity from '@src/data/video-entity';
import AudioEntity, { AudioEntityFactory } from '@src/data/audio-entity';
import { BaseEntity } from '@src/data/base-entity';
import { IJsonPageAudio } from '@db/data-pages';

export interface MediaTracks {
    [key: string]: string;
}

export interface PageAudioEntityProps {
    src: string;
    tracks?: MediaTracks;
}

export interface PageEntityProps {
    pageId: string;
    title: string;
    sortIdx: number;
    name: string;
    keywords?: string[];
    videos: VideoEntity[];
    cover?: string;
    audio?: IJsonPageAudio;
    audioTrack?: MediaTracks;
}

export default class PageEntity extends BaseEntity {
    constructor(protected readonly data: PageEntityProps, options) {
        super(options);
    }

    get pageId(): string {
        return this.data.pageId;
    }

    get name(): string {
        return this.data.name;
    }

    get title(): string {
        return this.data.title;
    }

    get keywords(): string[] {
        return this.data.keywords || [];
    }

    get videos(): VideoEntity[] {
        return this.data.videos;
    }

    countVideos(): number {
        return this.data.videos.length;
    }

    getFirstVideo(): VideoEntity {
        return this.data.videos[0];
    }

    hasAudio(): boolean {
        return this.data.audio !== undefined;
    }

    getAudioEntity(): AudioEntity | undefined {
        if (!this.hasAudio()) {
            return undefined;
        }
        return AudioEntityFactory.createFromData(this.data.audio as IJsonPageAudio, this.options);
    }
}
