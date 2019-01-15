// keep the main scss at top of everything to help webpack
// mini-css-extract-plugin to place it of top of the bundled styles
import '@styles/style.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import history from './history';

import App from './containers/app';

import '@public/favicon.ico';

import 'typeface-eb-garamond';
import 'typeface-im-fell-english';
import 'typeface-karla';
import 'typeface-source-sans-pro';

import 'typeface-spectral';
import 'typeface-lato';
import 'typeface-quicksand';
import 'typeface-raleway';
import 'typeface-fira-sans';
import 'typeface-eczar';

import { appConfig } from '@config/config';
import AppConfig from '@src/core/app-config';
import { register as registerServiceWorker, unregister as unregisterServiceWorker } from './register-service-worker';

import configureStore from './configure-store';
import { isChrome } from '@src/utils/browser-detect';

import './check-outdated-version';

const initialState = window.initialReduxState;
const store = configureStore(history, initialState);

const renderApp = (Component: any, config: AppConfig, elementId: string) => {
    render(
        <ReduxProvider store={store}>
            <Component appConfig={config} />
        </ReduxProvider>,
        document.getElementById(elementId)
    );
};
//console.log('appConfig', appConfig);
renderApp(App, appConfig, 'app');

// Only chrome allowed till workbox 4
if (isChrome(false)) {
    // Too much problems with service workers when using
    // other browsers, hope it's gonna be better once workbox-sw 4.0
    // have been released.
    registerServiceWorker({
        onSuccess: registration => {},
        onUpdate: registration => {
            /*
            console.log('An update was found, removing the serviceWorker');
            console.log('Lets show the pwa-version-notification');
            const notification = document.getElementById('pwa-version-notification');
            if (notification) {
                notification.className = 'show';
                notification.addEventListener('click', () => {
                    console.log('Clicked update !');
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.ready.then(reg => {
                            console.log('Unregistering the service worker');
                            reg.unregister().then(() => {
                                console.log('Reloading the page');
                                window.location.reload();
                            });
                        });
                    }
                });
            }
            */
        },
    });
} else {
    unregisterServiceWorker();
}
