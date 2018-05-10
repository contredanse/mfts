import { AbstractBaseEntity } from '@src/models/entity/abstract-base-entity';
import AppAssetsLocator from '@src/core/app-assets-locator';

describe('AbstractBaseEntity test suite', () => {
    class MockEntity extends AbstractBaseEntity {}

    it('should honour custom options', () => {
        const options = {
            fallbackLang: 'nl',
            assetsLocator: new AppAssetsLocator({ assetsUrls: { default: '' } }),
        };
        const entity = new MockEntity(options);
        expect(entity.options).toEqual(options);
    });
});
