import React from 'react';
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
    // only works with 'window' element / not 'document'
    'resize',
];

type IdleMonitorProps = {
    timeout?: number;
    events?: string[];
    element?: HTMLElement;
    enableOnMount: boolean;
    isActive?: boolean;
    onIdleChange?: (idle: boolean) => void;
    enableDebug: boolean;
};

const fiveSeconds = 5e3;
const defaultElement = isBrowser ? window : undefined;

const defaultProps = {
    isActive: true,
    timeout: fiveSeconds,
    enableOnMount: true,
    events: defaultEvents,
    element: defaultElement,
    enableDebug: false,
};

type IdleMonitorState = {
    idle: boolean;
};

const defaultState = {
    idle: false,
};

class IdleMonitor extends React.PureComponent<IdleMonitorProps, IdleMonitorState> {
    static defaultProps = defaultProps;

    timeoutHandle?: number;
    isCancelled = false;

    onEvent = throttle(50, () => {
        if (this.isCancelled) {
            clearTimeout(this.timeoutHandle);
        } else {
            if (this.state.idle) {
                this.setState(prevState => this.getIdleState(false, prevState));
            }
            clearTimeout(this.timeoutHandle);
            // typescript does not resolve correct
            // setTimeout version between node/browser
            this.timeoutHandle = setTimeout(() => {
                if (!this.isCancelled) {
                    this.setState(prevState => {
                        return this.getIdleState(this.props.isActive === true, prevState);
                    });
                }
            }, this.props.timeout) as any;
        }
    });

    constructor(props: IdleMonitorProps) {
        super(props);
        this.state = defaultState;
    }

    getIdleState = (idle: boolean, prevState: IdleMonitorState): IdleMonitorState | null => {
        const newIdle = this.isCancelled ? false : idle;
        if (newIdle === prevState.idle) {
            return null;
        }

        if (this.props.onIdleChange) {
            this.props.onIdleChange(newIdle);
        }
        return {
            idle: newIdle,
        };
    };

    async componentDidMount() {
        const { element, events, enableOnMount } = this.props;
        if (!element) {
            return;
        }
        events!.forEach(e => {
            element.addEventListener(e, this.onEvent, {
                passive: true,
            });
        });
        if (enableOnMount) {
            this.onEvent();
        }
    }

    componentWillUnmount() {
        this.isCancelled = true;

        clearTimeout(this.timeoutHandle);

        const { element, events } = this.props;
        if (!element) {
            return;
        }
        events!.forEach(e => {
            element.removeEventListener(e, this.onEvent);
        });

        if (this.props.onIdleChange) {
            this.props.onIdleChange(false);
        }
    }

    render() {
        const { idle } = this.state;
        if (this.props.enableDebug) {
            const debugComponent = (
                <div
                    style={{
                        position: 'fixed',
                        backgroundColor: 'blue',
                        bottom: '65px',
                        right: '15px',
                        border: '1px solid pink',
                        zIndex: 8000,
                    }}
                >
                    {idle ? 'IDLE' : 'NOTIDLE'}
                </div>
            );
            return debugComponent;
        }
        return null;
    }
}

export default IdleMonitor;
