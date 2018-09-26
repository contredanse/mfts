declare interface Window {
    initialReduxState: any;
    __REDUX_DEVTOOLS_EXTENSION__: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

declare interface ServiceWorkerConfig {
    onSuccess: (registration: ServiceWorkerRegistration) => void;
    onUpdate: (registration: ServiceWorkerRegistration) => void;
}

declare module '*.md' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    const value: string;
    export default value;
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.gif' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.json' {
    const value: any;
    export default value;
}

declare module '*.glsl' {
    const value: any;
    export = value;
}

/*
declare interface System {
    import<T = any>(module: string): Promise<T>
}
declare var System: System;


declare interface NodeModule {
    hot?: { accept: (path: string, callback: () => void) => void };
}*/
