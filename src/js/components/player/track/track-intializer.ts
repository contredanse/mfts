export class TrackInitializer {
    public static readonly storageKey = 'TrackInitializer.displayedLang';

    persistTrackLangInStorage(displayedLang?: string): void {
        try {
            if (displayedLang) {
                localStorage.setItem(TrackInitializer.storageKey, displayedLang);
            } else {
                localStorage.removeItem(TrackInitializer.storageKey);
            }
        } catch (e) {
            console.log('Cannot save displayedLang in localstorage');
        }
    }

    getTrackLangFromStorage(): string | null {
        try {
            const lang = localStorage.getItem(TrackInitializer.storageKey);
            if (lang) {
                return lang;
            }
        } catch (e) {
            // does not exists
        }
        return null;
    }
}
