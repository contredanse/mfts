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

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
};

// Because it does not work in jsdom
(HTMLMediaElement as any).prototype.play = (): Promise<any> => {
    return new Promise((resolve, reject) => {});
};

(HTMLMediaElement as any).prototype.load = () => {
    /* do nothing */
};
(HTMLMediaElement as any).prototype.pause = () => {
    /* do nothing */
};
(HTMLMediaElement as any).prototype.addTextTrack = () => {
    /* do nothing */
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

//const localStorage = localStorageMock;
