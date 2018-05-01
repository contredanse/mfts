export interface VideoSourceProps {
    src: string;
    type?: string; // mimetype (i.e. video/mp4, video/webm)
    codecs?: string; // extra codec information (i.e. vp9)
    priority?: number;
}

export default class VideoSourceEntity {
    public static fileTypes = {
        mp4: 'video/mp4',
        webm: 'video/webm',
    };

    constructor(protected readonly data: VideoSourceProps) {}

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
