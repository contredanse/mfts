export const hideAllSubtitles = (video: HTMLVideoElement): void => {
    for (let i = 0; i < video.textTracks.length; i++) {
        console.log('Hidding', video.textTracks[i]);
        video.textTracks[i].mode = 'hidden';
        console.log('New value', video.textTracks[i]);
    }
};

export const showSubtitle = (video: HTMLVideoElement, lang: string): void => {
    for (let i = 0; i < video.textTracks.length; i++) {
        // For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
        if (video.textTracks[i].language === lang) {
            console.log('SHOWING', video.textTracks[i]);
            video.textTracks[i].mode = 'showing';
            //this.setAttribute('data-state', 'active');
        } else {
            video.textTracks[i].mode = 'hidden';
        }
    }
};
