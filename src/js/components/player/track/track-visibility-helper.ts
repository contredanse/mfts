export type TrackVisibilityMode = 'hidden' | 'showing';

export default class TrackVisibilityHelper {
    public static readonly storageKey = 'TrackInitializer.visibilityMode';

    persistVisibilityModeInStorage(mode?: TrackVisibilityMode): void {
        console.log('persist in storage', mode);
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
        console.log('get visibility from storage');
        try {
            const mode = localStorage.getItem(TrackVisibilityHelper.storageKey);
            console.log('Mode', mode);
            if (mode && ['hidden', 'showing'].includes(mode)) {
                return mode as TrackVisibilityMode;
            }
            console.log('Error loading visibility');
        } catch (e) {
            // does not exists
        }

        return null;
    }
}
