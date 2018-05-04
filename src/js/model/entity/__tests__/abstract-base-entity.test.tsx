import { AbstractBaseEntity } from '@src/model/entity/abstract-base-entity';

describe('AbstractBaseEntity test suite', () => {
    class MockEntity extends AbstractBaseEntity {}

    it('should honour defaultOptions', () => {
        const entity = new MockEntity();
        expect(entity.options).toEqual(MockEntity.defaultOptions);
    });

    it('should honour custom options', () => {
        const options = {
            lang: 'fr',
            fallbackLang: 'nl',
        };
        const entity = new MockEntity(options);
        expect(entity.options).toEqual(options);
    });
});
