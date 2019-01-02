/**
 * @return count actual number of shown tracks
 */
export const showLocalizedTextTrack = (
    video: HTMLVideoElement,
    lang: string,
    kind: TextTrackKind = 'subtitles'
): boolean => {
    for (let i = 0; i < video.textTracks.length; i++) {
        if (video.textTracks[i].language === lang && video.textTracks[i].kind === kind) {
            const isLoaded = video.textTracks[i].cues !== null;
            video.textTracks[i].mode = 'showing';
        } else {
            video.textTracks[i].mode = 'hidden';
        }
    }

    return hasVisibleTextTrack(video);
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

export const getAvailableTrackLanguages = (video: HTMLVideoElement): string[] => {
    const langs = [];
    for (let i = 0; i < video.textTracks.length; i++) {
        langs.push(video.textTracks[i].language);
    }
    return langs;
};
