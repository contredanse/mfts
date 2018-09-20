// Global/Window object Stubs for Jest
window.matchMedia =
    window.matchMedia ||
    (() => {
        return {
            matches: false,
            addListener: () => {},
            removeListener: () => {},
        };
    });

window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
    setTimeout(callback);
    return 1;
};

(window as any).localStorage = {
    getItem: () => {},
    setItem: () => {},
};

Object.values = () => [];
