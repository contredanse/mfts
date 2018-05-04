import AppAssetsLocator from '@src/core/app-assets-locator';

describe('AppAssetsLocator test', () => {
    const assetsLocator = new AppAssetsLocator({
        assetsUrls: {
            default: 'http://default',
            videos: 'http://videos',
            videoCovers: '',
        },
    });

    it('should fallback to default baseUrl ', () => {
        expect(assetsLocator.getMediaTypeBaseUrl('audios')).toEqual('http://default');
    });

    it('it should append filename', () => {
        expect(assetsLocator.getMediaAssetUrl('videos', 'test.mp4')).toEqual('http://videos/test.mp4');
    });

    it('it should not add slash if baseUrl is empty', () => {
        expect(assetsLocator.getMediaAssetUrl('videoCovers', 'test.mp4')).toEqual('test.mp4');
    });
});
