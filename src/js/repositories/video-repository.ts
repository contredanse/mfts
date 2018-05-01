import { IDataVideo } from '@db/data-videos';

export default class VideoRepository {
    public readonly data: IDataVideo[];

    constructor(data: IDataVideo[]) {
        this.data = data;
    }

    async get(id: string): Promise<IDataVideo> {
        return new Promise<IDataVideo>((resolve, reject) => {
            const video = this.data.find((element: IDataVideo) => {
                return id === element.video_id;
            });
            if (video === undefined) {
                reject(`Video '${id}' cannot be found`);
            }
            resolve(video);
        });
    }
}
