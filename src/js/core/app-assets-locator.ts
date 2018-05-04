export interface IAssetsTypeUrls {
    default?: string;
    videos?: string;
    videoCovers?: string;
    videoSubs?: string;
    audios?: string;
    audioSubs?: string;
    pageCovers?: string;
}

export interface IAssetsLocatorProps {
    assetsUrls: IAssetsTypeUrls;
}

export type MediaAssetsType = keyof IAssetsTypeUrls;

export default class AppAssetsLocator {
    constructor(public readonly props: IAssetsLocatorProps) {}

    getMediaTypeBaseUrl(assetsType: MediaAssetsType): string {
        const { assetsUrls } = this.props;
        if (assetsType in this.props.assetsUrls) {
            return assetsUrls[assetsType] || '';
        }
        return assetsUrls.default || '';
    }

    getMediaAssetUrl(assetsType: MediaAssetsType, filename: string): string {
        const baseUrl = this.getMediaTypeBaseUrl(assetsType);
        if (baseUrl !== '') {
            return `${baseUrl}/${filename}`;
        }
        return filename;
    }
}
