import { appConfig } from '@config/config.production';

describe('Menu repository', () => {
    const menuRepo = appConfig.getMenuRepository();

    test('findMenuSection must return correct id', async () => {
        const menuId = 'sensation-and-senses.pelvis';
        const menu = await menuRepo.findMenuSection(menuId);
        expect(menu).toHaveProperty('id', menuId);
    });

    test('findMenuByPageId must return an existing page', async () => {
        const pageId = 'sensation-and-senses.gravity.falls';
        const menu = await menuRepo.findMenuByPageId(pageId);
        expect(menu).toHaveProperty('type', 'page');
        expect(menu).toHaveProperty('page_id', pageId);
    });

    test('getPrevAndNextPageMenu must return empty nav when page does not exists', async () => {
        const pageId = 'i dont exists';
        const nav = await menuRepo.getPrevAndNextPageMenu(pageId, 'en');
        expect(nav.next).toBe(undefined);
        expect(nav.current).toBe(undefined);
        expect(nav.previous).toBe(undefined);
    });

    test('getPrevAndNextPageMenu must return nav', async () => {
        const pageId = 'sensation-and-senses.gravity.falls';
        const nav = await menuRepo.getPrevAndNextPageMenu(pageId, 'en');
        expect(nav.current).toHaveProperty('page_id', pageId);
        expect(nav.previous).toHaveProperty('page_id', 'sensation-and-senses.gravity.the-flat-the-round');
        expect(nav.next).toHaveProperty('page_id', 'sensation-and-senses.gravity.water-gravity');
    });

    test('getPrevAndNextPageMenu must return partial nav for first item', async () => {
        const pageId = 'sensation-and-senses.weight-of-sensation';
        const nav = await menuRepo.getPrevAndNextPageMenu(pageId, 'en');
        expect(nav.current).toHaveProperty('page_id', pageId);
        expect(nav.previous).toBe(undefined);
        expect(nav.next).toHaveProperty('page_id', 'sensation-and-senses.gravity.the-flat-the-round');
    });

    test('getPrevAndNextPageMenu must return partial nav for last item', async () => {
        const pageId = 'forms.cultivating.kindling-scythe';
        const nav = await menuRepo.getPrevAndNextPageMenu(pageId, 'en');
        expect(nav.current).toHaveProperty('page_id', pageId);
        expect(nav.next).toBe(undefined);
        expect(nav.previous).toHaveProperty('page_id', 'forms.cultivating.dance-culture');
    });

    test('getPrevAndNextPageMenu must return partial nav for last item', async () => {
        const pageId = 'forms.cultivating.dance-culture';
        const nav = await menuRepo.getPrevAndNextPageMenu(pageId, 'en');
        expect(nav.current).toHaveProperty('page_id', pageId);
        expect(nav.next).toHaveProperty('page_id', 'forms.cultivating.kindling-scythe');
    });

    test('getPageBreadcrumbTest', async () => {
        const pageId = 'forms.cultivating.dance-culture';
        const breadcrumb = menuRepo.getPageBreadcrumb(pageId, 'en');
        expect(breadcrumb).toHaveLength(2);
        expect(breadcrumb[0]).toEqual({
            id: 'forms',
            title: 'FORMS',
        });
    });
});
