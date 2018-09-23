import { AppLanguage } from '@src/core/app-language';

describe('AppLanguage test', () => {
    const appLang = new AppLanguage();

    it('must support fallback language', () => {
        expect(appLang.isSupportedLang(appLang.fallbackLang)).toBeTruthy();
    });

    it('should persist to localstorage', () => {
        const lang = 'fr';
        appLang.persistLanguageInStorage(lang);
        expect(window.localStorage.setItem).toHaveBeenLastCalledWith(appLang.storageKey, lang);
    });

    it('should read lang from localstorage', () => {
        appLang.getLanguageFromStorage();
        expect(localStorage.getItem).toBeCalledWith(appLang.storageKey);
    });
});
