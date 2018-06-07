export type PlayerActions = {
    pause: () => void;
    play: () => void;
    setPlaybackRate: (playbackRate: number) => void;
    setCurrentTime: (currentTime: number) => void;
};
