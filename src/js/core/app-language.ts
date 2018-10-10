export class AppLanguage {
    public static readonly storageKey = 'AppLanguage.lang';
    readonly supportedLangs = ['en', 'fr'];
    readonly fallbackLang = 'en';

    persistLanguageInStorage(lang: string): void {
        try {
            localStorage.setItem(AppLanguage.storageKey, lang);
        } catch (e) {
            console.log('Cannot save lang in localstorage');
        }
    }

    isSupportedLang(lang: string): boolean {
        return this.supportedLangs.includes(lang);
    }

    getInitialLanguage(): string {
        // Route is the ultimate truth ;)
        let lang = this.getLanguageFromRoute();
        if (lang !== null) {
            return lang;
        }

        // Then localStorage
        lang = this.getLanguageFromStorage();
        if (lang !== null) {
            return lang;
        }

        // Finally browser
        lang = this.getLanguageFromBrowser();
        if (lang !== null) {
            return lang;
        }

        return this.fallbackLang;
    }

    getLanguageFromStorage(): string | null {
        try {
            const lang = localStorage.getItem(AppLanguage.storageKey);
            if (lang && this.isSupportedLang(lang)) {
                return lang;
            }
        } catch (e) {
            console.log('Cannot get lang from localstorage');
        }
        return null;
    }

    /**
     * Return language from browser
     */
    getLanguageFromBrowser(): string | null {
        if ('language' in navigator) {
            if (navigator.language.startsWith('fr')) {
                return 'fr';
            }
            return this.fallbackLang;
        }
        return null;
    }

    /**
     * Return language from route (document.location.href)
     */
    getLanguageFromRoute(): string | null {
        if (document.location) {
            const matches = document.location.href.match(new RegExp('//(fr|en)//'));
            if (Array.isArray(matches) && this.isSupportedLang(matches[1])) {
                return matches[1];
            }
        }
        // otherwise
        return null;
    }
}
