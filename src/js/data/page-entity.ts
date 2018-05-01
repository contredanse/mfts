import VideoEntity from '@src/data/video-entity';

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
    audio?: PageAudioEntityProps;
    audioTrack?: MediaTracks;
}

export default class PageEntity {
    constructor(protected readonly data: PageEntityProps) {}

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

    hasAudio(): boolean {
        return this.data.audio !== undefined;
    }

    hasAudioTracks(): boolean {
        return this.data.audio !== undefined && this.data.audio.tracks !== undefined;
    }

    getAudioTracks(): MediaTracks | undefined {
        if (!this.hasAudioTracks()) {
            return undefined;
        }
        return (this.data.audio as PageAudioEntityProps).tracks;
    }
    getAudio(): PageAudioEntityProps | undefined {
        return this.data.audio;
    }
    getAudioSource(): string | undefined {
        if (!this.hasAudio()) {
            return undefined;
        }
        return (this.data.audio as PageAudioEntityProps).src;
    }
}
