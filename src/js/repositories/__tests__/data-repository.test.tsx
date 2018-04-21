import DataRepository, { IParams } from '../data-repository';

describe('Data repository params', () => {
    test('getParams returns params from constructor', () => {
        const params: IParams = {
            defaultLang: 'en',
        };
        const dataRepo = new DataRepository([], params);
        expect(dataRepo.getParams()).toEqual(params);
    });
});

describe('Data repository getters', () => {
    const params = {
        defaultLang: 'en',
    };
    const data = [];
    const globalDataRepo = new DataRepository(data, params);

    test('getPage should reject for non existing page', async () => {
        await expect(globalDataRepo.getPage('non-existing-page')).rejects.toThrow(
            "Page 'non-existing-page' cannot be found"
        );
    });
});
