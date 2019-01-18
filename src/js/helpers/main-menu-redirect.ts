/**
 * If you update, please reflect the changes in _variables.scss too
 */

export const helixMenuIconMinimumWidth = 650;
export const helixMenuIconMinimumHeight = 400;

export const isScreenAdaptedForHelixMenu = (): boolean => {
    const screenWidth = window.innerWidth || window.screen.width;
    const screenHeight = window.innerHeight || window.screen.height;
    return screenWidth >= helixMenuIconMinimumWidth && screenHeight >= helixMenuIconMinimumHeight;
};

export const getMainMenuRoute = (lang: string, pageId?: string): string => {
    const menuId = isScreenAdaptedForHelixMenu() ? 'menu' : 'page-list';
    if (pageId) {
        return `/${lang}/${menuId}/${pageId}`;
    }
    return `/${lang}/${menuId}`;
};
