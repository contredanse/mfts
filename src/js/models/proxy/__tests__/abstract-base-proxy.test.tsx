import { AbstractBaseProxy } from '../abstract-base-proxy';
import AppAssetsLocator from '../../../core/app-assets-locator';

describe('AbstractBaseProxy test suite', () => {
    class MockEntity extends AbstractBaseProxy {}

    it('should honour custom options', () => {
        const options = {
            fallbackLang: 'nl',
            assetsLocator: new AppAssetsLocator({ assetsUrls: { default: '' } }),
        };
        const entity = new MockEntity(options);
        expect(entity.options).toEqual(options);
    });
});
