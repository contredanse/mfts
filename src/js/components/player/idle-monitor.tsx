import React, { Component, ReactNode } from 'react';
import { throttle } from 'throttle-debounce';

const isBrowser = (typeof window === 'undefined' ? 'undefined' : typeof window) === 'object';

const defaultEvents = [
    'mousemove',
    'keydown',
    'wheel',
    'DOMMouseScroll',
    'mouseWheel',
    'mousedown',
    'touchstart',
    'touchmove',
    'MSPointerDown',
    'MSPointerMove',
];

type IdleMonitorProps = {
    timeout?: number;
    events?: string[];
    element?: HTMLElement;
};

const fiveSeconds = 5e3;
const defaultElement = isBrowser ? document : undefined;

const defaultProps = {
    timeout: fiveSeconds,
    events: defaultEvents,
    element: defaultElement,
};

type IdleMonitorState = {
    idle: boolean;
};

const defaultState = {
    idle: false,
};

class IdleMonitor extends Component<IdleMonitorProps, IdleMonitorState> {
    static defaultProps = defaultProps;

    timeoutHandle?: number;

    onEvent = throttle(50, () => {
        if (this.state.idle) {
            this.setState({
                idle: false,
            });
        }
        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
        }
        this.timeoutHandle = setTimeout(() => {
            this.setState({
                idle: true,
            });
        }, this.props.timeout) as // typescript does not resolve correct
        // setTimeout version between node/browser
        any;
    });

    constructor(props: IdleMonitorProps) {
        super(props);
        this.state = defaultState;

        //this.onEvent
    }

    componentDidMount() {
        const { element, events } = this.props;
        if (!element) {
            return;
        }
        events!.forEach(e => {
            element.addEventListener(e, this.onEvent, {
                capture: true,
                passive: true,
            });
        });
        //document.addEventListener('visibilitychange', onVisibility);
    }

    componentWillUnmount() {
        const { element, events } = this.props;
        if (!element) {
            return;
        }
        events!.forEach(e => {
            element.removeEventListener(e, this.onEvent);
        });
    }

    render() {
        const { idle } = this.state;
        return (
            <div style={{ position: 'static', top: '20px', right: '80px', border: '1px solid pink', zIndex: 8000 }}>
                {idle ? 'IDLE' : 'NOTIDLE'}
            </div>
        );
        return null;
        /*
        const { children } = this.props;
        return children || null;
        */
    }
}

export default IdleMonitor;
