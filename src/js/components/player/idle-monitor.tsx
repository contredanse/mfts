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
    // only works with 'window'
    'resize',
];

type IdleMonitorProps = {
    timeout?: number;
    events?: string[];
    element?: HTMLElement;
};

const fiveSeconds = 5e3;
const defaultElement = isBrowser ? window : undefined;

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
    isCancelled = false;

    onEvent = throttle(50, () => {
        //console.log('e', e);

        if (this.isCancelled) {
            if (this.timeoutHandle) {
                clearTimeout(this.timeoutHandle);
            }
        } else {
            if (this.state.idle) {
                this.setState(prevState => ({
                    ...prevState,
                    idle: false,
                }));
            }
            if (this.timeoutHandle) {
                clearTimeout(this.timeoutHandle);
            }
            this.timeoutHandle = setTimeout(() => {
                this.setState(prevState => ({
                    ...prevState,
                    idle: true,
                }));
            }, this.props.timeout) as any;
            // typescript does not resolve correct
            // setTimeout version between node/browser
        }
    });

    constructor(props: IdleMonitorProps) {
        super(props);
        this.state = defaultState;
    }

    async componentDidMount() {
        const { element, events } = this.props;
        if (!element) {
            return;
        }
        events!.forEach(e => {
            element.addEventListener(e, this.onEvent, {
                passive: true,
            });
        });
    }

    componentWillUnmount() {
        this.isCancelled = true;

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
            <div
                style={{
                    position: 'fixed',
                    backgroundColor: 'blue',
                    bottom: '15px',
                    right: '15px',
                    border: '1px solid pink',
                    zIndex: 8000,
                }}
            >
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
