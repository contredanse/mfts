export const hideAllSubtitles = (video: HTMLVideoElement): void => {
    console.log('hideall textTracks', video.textTracks);
    for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].mode = 'hidden';
    }
};

export const showSubtitle = (video: HTMLVideoElement, lang: string): void => {
    console.log('show textTracks', video.textTracks);
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

export const debugSubtitlesLoading = (video: HTMLVideoElement): void => {
    console.log('WILL debug subtitles');

    for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].addEventListener('cuechange', (a: Event) => {
            console.log('cuechange', a);
        });

        video.textTracks[i].addEventListener('onload', (a: Event) => {
            console.log('onload', a);
        });
        video.textTracks[i].addEventListener('onerror', (a: Event) => {
            console.log('onerror', a);
        });
    }
};
