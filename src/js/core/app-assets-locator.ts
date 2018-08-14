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

export type AppAssetsLocatorTypes = keyof IAssetsTypeUrls;

export default class AppAssetsLocator {
    public readonly props: IAssetsLocatorProps;

    constructor(props: IAssetsLocatorProps) {
        this.props = props;
    }

    getMediaTypeBaseUrl(assetsType: AppAssetsLocatorTypes): string {
        const { assetsUrls } = this.props;
        if (assetsType in this.props.assetsUrls) {
            return assetsUrls[assetsType] || '';
        }
        return assetsUrls.default || '';
    }

    getMediaAssetUrl(assetsType: AppAssetsLocatorTypes, filename: string): string {
        const baseUrl = this.getMediaTypeBaseUrl(assetsType);
        if (baseUrl !== '') {
            return `${baseUrl}/${filename}`;
        }
        return filename;
    }
}
