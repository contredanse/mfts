import React from 'react';

import './pwa-installer.scss';

type Props = {
    displayTimeout: number;
};

type State = {
    installed: boolean;
};

const defaultProps = {
    displayTimeout: 30,
};

class PwaInstaller extends React.Component<Props, State> {
    static defaultProps = defaultProps;
    readonly state = {
        installed: true,
    };

    deferredPrompt?: BeforeInstallPromptEvent;

    componentDidMount() {
        window.addEventListener('beforeinstallprompt', this.beforeInstallPrompt as (e: Event) => void);
    }
    componentWillUnmount() {
        window.removeEventListener('beforeinstallprompt', this.beforeInstallPrompt as (e: Event) => void);
    }

    beforeInstallPrompt = (e: BeforeInstallPromptEvent): void => {
        console.log('beforeinstallprompt Event fired');
        this.setState({ installed: false });
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;
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
                } else {
                    console.log('User added to home screen');
                }
                // We no longer need the prompt.  Clear it up.
                this.deferredPrompt = undefined;
            });
        }
    };

    render() {
        const { installed } = this.state;
        //const installed = false;
        return (
            !installed && (
                <div className="add-to-homescreen-container">
                    <button onClick={this.requestAddToHomescreen}>Add to homescreen</button>
                </div>
            )
        );
    }
}

export default PwaInstaller;
