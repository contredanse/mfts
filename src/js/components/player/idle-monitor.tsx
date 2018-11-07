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
    // only works with 'window'
    'resize',
];

type IdleMonitorProps = {
    timeout?: number;
    events?: string[];
    element?: HTMLElement;
    isActive?: boolean;
    enableDebug: boolean;
};

const fiveSeconds = 5e3;
const defaultElement = isBrowser ? window : undefined;

const defaultProps = {
    isActive: true,
    timeout: fiveSeconds,
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
                this.setState((prevState, props) => this.getIdleState(false));
            }
            clearTimeout(this.timeoutHandle);
            // typescript does not resolve correct
            // setTimeout version between node/browser
            this.timeoutHandle = setTimeout(() => {
                if (!this.isCancelled) {
                    this.setState((prevState, props) => {
                        return this.getIdleState(props.isActive === true);
                    });
                }
            }, this.props.timeout) as any;
        }
    });

    constructor(props: IdleMonitorProps) {
        super(props);
        this.state = defaultState;
    }

    getIdleState = (idle: boolean): IdleMonitorState => {
        if (!this.isCancelled) {
            return {
                idle: idle,
            };
        } else {
            return {
                idle: false,
            };
        }
    };

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

        clearTimeout(this.timeoutHandle);

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

        if (this.props.enableDebug) {
            const debugComponent = (
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
            return debugComponent;
        }
        return null;
    }
}

export default IdleMonitor;
