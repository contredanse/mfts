import { AudioProxyFactory } from '@src/models/proxy/audio-proxy';
import { IJsonPageAudio } from '@data/json/data-pages';
import AppAssetsLocator from '../../../core/app-assets-locator';

describe('AudioProxy from IJsonPageAudio', () => {
    const jsonAudio: IJsonPageAudio = {
        src: {
            en: 'source_en.mp3',
            fr: 'source_fr.mp3',
        },
        tracks: [{ lang: 'en', src: 'track_en.vtt' }, { lang: 'fr', src: 'track_fr.vtt' }],
    };

    const jsonAudioBackup = JSON.stringify(jsonAudio);

    const audio = AudioProxyFactory.createFromJson(jsonAudio, {
        fallbackLang: 'en',
        assetsLocator: new AppAssetsLocator({ assetsUrls: { default: '' } }),
    });

    it('should return a source file', () => {
        const srcFile = audio.getSourceFile();
        expect(srcFile).toEqual('source_en.mp3');
        expect(audio.getSourceFile('fr')).toEqual('source_fr.mp3');
        expect(audio.getSourceFile('fr', 'http://a.com')).toEqual('http://a.com/source_fr.mp3');
    });

    it('should have tracks', () => {
        expect(audio.hasTrack()).toBe(true);
    });

    it('must add baseUrl to sources', () => {
        const tracks = audio.getAllTracks('http://a.com');
        expect(tracks[0].src).toEqual(`http://a.com/${(jsonAudio.tracks as any)[0].src}`);
        const tracksWithoutBaseUrl = audio.getAllTracks();
        expect(tracksWithoutBaseUrl[0].src).toEqual((jsonAudio.tracks as any)[0].src);
    });

    test('tracks must be the same as the original', () => {
        expect(audio.getAllTracks()).toEqual(jsonAudio.tracks);
    });

    test('immutability', () => {
        expect(jsonAudioBackup).toEqual(JSON.stringify(jsonAudio));
    });
});
