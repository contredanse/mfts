export const hideAllSubtitles = (video: HTMLVideoElement): void => {
    for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].mode = 'hidden';
    }
};

export const showSubtitle = (video: HTMLVideoElement, lang: string): void => {
    for (let i = 0; i < video.textTracks.length; i++) {
        if (video.textTracks[i].language === lang) {
            video.textTracks[i].mode = 'showing';
        } else {
            video.textTracks[i].mode = 'hidden';
        }
    }
};

export const hasShownSubtitle = (video: HTMLVideoElement): boolean => {
    for (let i = 0; i < video.textTracks.length; i++) {
        if (video.textTracks[i].mode === 'showing') {
            return true;
        }
    }
    return false;
};
