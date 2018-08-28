import { appConfig } from '@config/config.production';

describe('Menu repository', () => {
    const menuRepo = appConfig.getMenuRepository();

    test('findMenu must return data', async () => {
        const menuId = 'sensation-and-senses.pelvis';

        const menu = await menuRepo.findMenu(menuId);
        expect(menu).toHaveProperty('id', menuId);
    });
});
