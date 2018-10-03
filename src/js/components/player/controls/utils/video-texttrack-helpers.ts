export type TextTrackKind = 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';

export type TextTrackHTMLAttributes = {
    kind: TextTrackKind;
    src: string;
    srcLang: string;
    label: string;
    default?: boolean;
};

export const getVideoTextTrackNodes = (video: HTMLVideoElement): NodeListOf<HTMLTrackElement> => {
    return video.querySelectorAll('track');
};

/**
 *
 * @return number of removed track nodes
 */
export const removeVideoTextTrackNodes = (video: HTMLVideoElement): number => {
    let countRemoved = 0;
    getVideoTextTrackNodes(video).forEach((trackNode: HTMLTrackElement) => {
        video.removeChild(trackNode);
        countRemoved++;
    });
    return countRemoved;
};

export const createVideoTextTrackNode = (textTrack: TextTrackHTMLAttributes): HTMLTrackElement => {
    const track = document.createElement('track') as HTMLTrackElement;
    track.setAttribute('kind', textTrack.kind);
    track.setAttribute('label', textTrack.label);
    track.setAttribute('srcLang', textTrack.srcLang);
    track.setAttribute('src', textTrack.src);
    if (textTrack.default) {
        track.setAttribute('default', 'default');
    }
    return track;
};

/**
 * Will append text tracks
 * @return added video tracks
 */
export const appendVideoTextTrackNodes = (
    video: HTMLVideoElement,
    textTracks: TextTrackHTMLAttributes[]
): HTMLTrackElement[] => {
    const trackNodes: HTMLTrackElement[] = [];
    textTracks.forEach(textTrack => {
        const trackNode = createVideoTextTrackNode(textTrack);
        trackNode.addEventListener('load', (e: Event) => {
            const currentTrack = e.currentTarget as HTMLTrackElement;
            if (currentTrack.default) {
                currentTrack.track.mode = 'showing';
                // thanks Firefox (not needed anymore)
                //video.textTracks[trackIdx].mode = 'showing';
            } else {
                currentTrack.track.mode = 'hidden';
                // thanks Firefox (not needed anymore)
                //video.textTracks[trackIdx].mode = 'hidden';
            }
        });
        trackNodes.push(video.appendChild(trackNode));
    });
    return trackNodes;
};

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
