import { IDataPage } from '@data/data-pages';

export interface IDataPageWithMedia extends IDataPage {
    videos: any[];
    audio?: any;
    subtitle?: any;
}

export default class PageRepository {
    public readonly data: IDataPage[];

    constructor(data: IDataPage[]) {
        this.data = data;
    }

    /**
     * Get raw page information
     * @param {string} id
     * @returns {Promise<IDataPage>}
     */
    async get(id: string): Promise<IDataPage> {
        return new Promise<IDataPage>((resolve, reject) => {
            const page = this.data.find((element: IDataPage) => {
                return id === element.id;
            });
            if (page === undefined) {
                reject(`Page '${id}' cannot be found`);
            }
            resolve(page);
        });
    }

    /**
     * Get translated page with infos
     * @param {string} pageId
     * @param {string} lang
     * @returns {Promise<IDataPageWithMedia>}
     */
    async getPageWithMedias(pageId: string, lang: string): Promise<IDataPageWithMedia> {
        return new Promise<IDataPageWithMedia>((resolve, reject) => {
            const page = this.data.find((element: IDataPage) => {
                return pageId === element.id;
            });
            if (page === undefined) {
                reject(`Page '${pageId}' cannot be found`);
            }
            const { content } = page as IDataPage;

            const videos: any[] = [];
            let audio: any;
            let subtitle: any;

            // Step 1: select video(s)
            if (content.video !== undefined) {
                // single-video
                videos.push(content.video);
            } else if (content.video_i18n !== undefined) {
                // translated video
                videos.push(content.video_i18n[lang]);
            } else if (content.videos !== undefined) {
                // multiple videos
                videos.push(...content.videos);
            }

            // Step 2: select audio track
            if (content.audio_i18n !== undefined) {
                audio = content.audio_i18n[lang];
            } else if (content.audio !== undefined) {
                audio = content.audio;
            }

            // Step 3: general subtitles
            if (content.subs !== undefined) {
                subtitle = content.subs[lang];
            }

            const p = {
                ...page,
                videos: videos,
                audio: audio,
                subtitle: subtitle,
            } as IDataPageWithMedia;

            resolve(p);
        });
    }
}
