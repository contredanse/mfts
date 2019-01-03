import React from 'react';

import './pwa-installer.scss';
import i18n from './pwa-installer.i18n';

import { Transition } from 'react-transition-group';
import { getFromDictionary } from '@src/i18n/basic-i18n';

type Props = {
    lang?: string;
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
    defaultLang: 'en',
    displayTimeout: 5000,
    hideTimeout: 200000,
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

    hideA2hsPrompt = (): void => {
        clearTimeout(this.hideTimeoutHandle);
        this.setState({
            showPrompt: false,
            cancelled: true,
        });
    };

    requestAddToHomescreen = () => {
        if (this.deferredPrompt !== undefined) {
            // The user has had a positive interaction with our app and Chrome
            // has tried to prompt previously, so let's show the prompt.
            this.deferredPrompt.prompt().catch(() => {
                console.error('A2HS promise prompt error');
            });
            // Follow what the user has done with the prompt.
            this.deferredPrompt.userChoice
                .then(choiceResult => {
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
                })
                .catch(() => {
                    console.error('A2HS userChoice promise prompt error');
                });
        }
    };

    render() {
        const { showPrompt } = this.state;
        return (
            <Transition timeout={300} appear={true} exit={true} in={showPrompt}>
                {status => (
                    <div className={`a2hs-container a2hs-container-${status}`}>
                        <div className="message">
                            <a onClick={this.requestAddToHomescreen}>{this.tr('add_to_homescreen')}</a>
                        </div>
                        <div className="dismiss" onClick={this.hideA2hsPrompt}>
                            ✖
                        </div>
                    </div>
                )}
            </Transition>
        );
    }

    private tr = (text: string): string => {
        return getFromDictionary(text, this.props.lang!, i18n);
    };
}

export default PwaInstaller;
