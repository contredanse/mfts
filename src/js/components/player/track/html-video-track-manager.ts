export type TextTrackKind = 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';

export type TextTrackHTMLAttributes = {
    kind: TextTrackKind;
    src: string;
    srcLang: string;
    label: string;
    default?: boolean;
};

export default class HTMLVideoTrackManager {
    private videoEl: HTMLVideoElement;

    constructor(videoEl: HTMLVideoElement) {
        this.videoEl = videoEl;
    }

    static createTrackNode(textTrack: TextTrackHTMLAttributes): HTMLTrackElement {
        const track = document.createElement('track');
        track.setAttribute('kind', textTrack.kind);
        track.setAttribute('label', textTrack.label);
        track.setAttribute('srcLang', textTrack.srcLang);
        track.setAttribute('src', textTrack.src);
        if (textTrack.default) {
            // because track.setAttribute('default', 'default') don't work for FF
            track.default = true;
        }
        return track;
    }

    /**
     * Return all HTMLTrackElement nodes associated
     * to this video element.
     */
    getVideoTrackNodes(): NodeListOf<HTMLTrackElement> {
        return this.videoEl.querySelectorAll('track');
    }

    /**
     * Removes all HTMLTrackElement nodes under video element
     * @return {number} number of tracks removed
     */
    removeVideoTrackNodes(): number {
        let countRemoved = 0;
        this.getVideoTrackNodes().forEach((trackNode: HTMLTrackElement) => {
            this.videoEl.removeChild(trackNode);
            countRemoved++;
        });
        return countRemoved;
    }

    appendTrackNodes(
        textTracks: TextTrackHTMLAttributes[],
        events?: {
            onLoad?: (e: Event) => void;
        }
    ): HTMLTrackElement[] {
        const trackNodes: HTMLTrackElement[] = [];
        textTracks.forEach(textTrack => {
            const trackNode = HTMLVideoTrackManager.createTrackNode(textTrack);

            if (events && events.onLoad) {
                trackNode.addEventListener('load', events.onLoad);
            }

            trackNodes.push(this.videoEl.appendChild(trackNode));
        });
        return trackNodes;
    }
}
