import { AppLanguage } from '@src/core/app-language';

describe('AppLanguage test', () => {
    const appLang = new AppLanguage();

    it('must support fallback language', () => {
        expect(appLang.isSupportedLang(appLang.fallbackLang)).toBeTruthy();
    });

    it('should persist to localstorage', () => {
        const lang = 'fr';
        appLang.persistLanguageInStorage(lang);
        expect(window.localStorage.setItem).toHaveBeenLastCalledWith(AppLanguage.storageKey, lang);
    });

    it('should read lang from localstorage', () => {
        appLang.getLanguageFromStorage();
        expect(localStorage.getItem).toBeCalledWith(AppLanguage.storageKey);
    });

    it('should find lang from route', () => {
        expect(appLang.getLanguageFromRoute('http://test.com/fr/page_id')).toEqual('fr');
        expect(appLang.getLanguageFromRoute('http://test.com/test/en/page_id')).toEqual('en');
        expect(appLang.getLanguageFromRoute('http://test.com/nl/page_id')).toEqual(null);
    });
});
