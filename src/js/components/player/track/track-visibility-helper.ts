export type VisibilityMode = 'hidden' | 'showing';

export default class TrackVisibilityHelper {
    public static readonly storageKey = 'TrackInitializer.visibilityMode';

    persistVisibilityModeInStorage(mode?: VisibilityMode): void {
        try {
            if (mode) {
                localStorage.setItem(TrackVisibilityHelper.storageKey, mode);
            } else {
                localStorage.removeItem(TrackVisibilityHelper.storageKey);
            }
        } catch (e) {
            console.log('Cannot save displayedLang in localstorage');
        }
    }

    getVisibilityModeFromStorage(): VisibilityMode | null {
        try {
            const mode = localStorage.getItem(TrackVisibilityHelper.storageKey);
            if (mode && mode in ['hidden', 'showing']) {
                return mode as VisibilityMode;
            }
        } catch (e) {
            // does not exists
        }

        return null;
    }
}
