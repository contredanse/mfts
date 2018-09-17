import { IJsonVideoSource } from '../../../../data/json/data-videos';
import { VideoSourceProxyFactory } from '@src/models/proxy/video-source-proxy';
import AppAssetsLocator from '../../../core/app-assets-locator';

describe('VideoProxySource from IJsonVideoSource', () => {
    const jsonSource: IJsonVideoSource = {
        src: 'intro.mp4',
        priority: 20,
        type: 'video/type/mp4',
        codecs: 'vp9,orbis',
    };

    const jsonSourceBackup = JSON.stringify(jsonSource);

    const source = VideoSourceProxyFactory.createFromJson(jsonSource, {
        fallbackLang: 'en',
        assetsLocator: new AppAssetsLocator({ assetsUrls: { default: '' } }),
    });

    test('properties', () => {
        expect(source.type).toEqual('video/type/mp4');
        expect(source.priority).toEqual(20);
        expect(source.codecs).toEqual('vp9,orbis');
        expect(source.src).toEqual('intro.mp4');
    });

    test('methods', () => {
        expect(source.getSource('http://a.com')).toEqual('http://a.com/intro.mp4');
        expect(source.getSource()).toEqual('intro.mp4');
    });

    test('immutability', () => {
        expect(jsonSourceBackup).toEqual(JSON.stringify(jsonSource));
    });
});
