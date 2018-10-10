/**
 * @return number of shown tracks (generally 1 or 0 if no match)
 */
export const showLocalizedTextTrack = (
    video: HTMLVideoElement,
    lang: string,
    kind: TextTrackKind = 'subtitles'
): number => {
    let countShown = 0;
    for (let i = 0; i < video.textTracks.length; i++) {
        if (video.textTracks[i].language === lang && video.textTracks[i].kind === kind) {
            video.textTracks[i].mode = 'showing';
            countShown++;
        } else {
            video.textTracks[i].mode = 'hidden';
        }
    }
    return countShown;
};

/**
 * @return number of hidden tracks
 */
export const hideAllTextTracks = (video: HTMLVideoElement): number => {
    let countHidden = 0;
    for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].mode = 'hidden';
        countHidden++;
    }
    return countHidden;
};

export const hasVisibleTextTrack = (video: HTMLVideoElement): boolean => {
    for (let i = 0; i < video.textTracks.length; i++) {
        if (video.textTracks[i].mode === 'showing') {
            return true;
        }
    }
    return false;
};

export const hasTextTrack = (video: HTMLVideoElement): boolean => {
    return video.textTracks.length > 0;
};
