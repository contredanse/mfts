import React from 'react';

import './pwa-installer.scss';

import { Transition } from 'react-transition-group';

type Props = {
    displayTimeout?: number;
    hideTimeout?: number;
};

type State = {
    showPrompt: boolean;
    installed: boolean;
    cancelled: boolean;
    standalone: boolean;
};

const defaultProps = {
    displayTimeout: 5000,
    hideTimeout: 20000,
};

export const isStandAlone = (): boolean => {
    return window.matchMedia('(display-mode: standalone)').matches;
};

class PwaInstaller extends React.PureComponent<Props, State> {
    static defaultProps = defaultProps;
    readonly state = {
        showPrompt: false,
        installed: false,
        cancelled: false,
        standalone: false,
    };
    timeoutHandle?: number;
    hideTimeoutHandle?: number;

    deferredPrompt?: BeforeInstallPromptEvent;

    componentDidMount() {
        window.addEventListener('beforeinstallprompt', this.beforeInstallPrompt as (e: Event) => void);
        this.displayA2hsPrompt();
    }
    componentWillUnmount() {
        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
        }
        if (this.hideTimeoutHandle) {
            clearTimeout(this.hideTimeoutHandle);
        }
        window.removeEventListener('beforeinstallprompt', this.beforeInstallPrompt as (e: Event) => void);
    }

    beforeInstallPrompt = (e: BeforeInstallPromptEvent): void => {
        console.log('beforeinstallprompt event fired', e);

        // Prevent Chrome 67 and earlier from
        // automatically showing the prompt
        e.preventDefault();

        if (isStandAlone()) {
            // Already in standalone mode
            // Nothing to install ;)
            this.setState({
                standalone: true,
                showPrompt: false,
            });
        } else {
            // Stash the event so it can be triggered later.
            this.deferredPrompt = e;

            this.displayA2hsPrompt();
        }
    };

    displayA2hsPrompt = (): void => {
        if (this.timeoutHandle === undefined) {
            this.timeoutHandle = setTimeout(() => {
                this.setState({
                    showPrompt: true,
                    installed: false,
                });
                this.hideTimeoutHandle = setTimeout(() => {
                    this.setState({
                        showPrompt: false,
                    });
                }, this.props.hideTimeout) as any;
            }, this.props.displayTimeout) as any;
        }
    };

    requestAddToHomescreen = () => {
        if (this.deferredPrompt !== undefined) {
            // The user has had a positive interaction with our app and Chrome
            // has tried to prompt previously, so let's show the prompt.
            this.deferredPrompt.prompt();
            // Follow what the user has done with the prompt.
            this.deferredPrompt.userChoice.then(choiceResult => {
                console.log(choiceResult.outcome);
                if (choiceResult.outcome === 'dismissed') {
                    console.log('User cancelled home screen install');
                    this.setState({
                        showPrompt: false,
                        cancelled: true,
                        installed: false,
                    });
                } else {
                    console.log('User added to home screen');
                    this.setState({
                        showPrompt: false,
                        cancelled: false,
                        installed: true,
                    });
                }
                // We no longer need the prompt.  Clear it up.
                this.deferredPrompt = undefined;
            });
        }
    };

    render() {
        const { showPrompt } = this.state;
        return (
            <Transition timeout={500} appear={true} exit={true} in={showPrompt}>
                {status => (
                    <div className={`a2hs-container a2hs-container-${status}`}>
                        <button onClick={this.requestAddToHomescreen}>Add to homescreen</button>
                    </div>
                )}
            </Transition>
        );
    }
}

export default PwaInstaller;
