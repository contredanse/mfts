export type TrackVisibilityMode = 'hidden' | 'showing';

export default class TrackVisibilityHelper {
    public static readonly storageKey = 'TrackInitializer.visibilityMode';

    persistVisibilityModeInStorage(mode?: TrackVisibilityMode): void {
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

    getVisibilityModeFromStorage(): TrackVisibilityMode | null {
        try {
            const mode = localStorage.getItem(TrackVisibilityHelper.storageKey);
            if (mode && ['hidden', 'showing'].includes(mode)) {
                return mode as TrackVisibilityMode;
            }
        } catch (e) {
            // does not exists
        }

        return null;
    }
}
