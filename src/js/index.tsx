// keep the main scss at top of everything to help webpack
// mini-css-extract-plugin to place it of top of the bundled styles
import '@styles/style.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import history from './history';

import App from './containers/app';

import '@public/favicon.ico';

import 'typeface-karla';

import { appConfig } from '@config/config';
import AppConfig from '@src/core/app-config';
import { register as registerServiceWorker, unregister as unregisterServiceWorker } from './register-service-worker';

import configureStore from './configure-store';
import { isChrome } from '@src/utils/browser-detect';

import './check-outdated-version';
import { ErrorBoundary } from '@src/components/error/error-boundary';

const initialState = window.initialReduxState;
const store = configureStore(history, initialState);

const renderApp = (Component: any, config: AppConfig, elementId: string) => {
    render(
        <ErrorBoundary>
            <ReduxProvider store={store}>
                <Component appConfig={config} />
            </ReduxProvider>
        </ErrorBoundary>,
        document.getElementById(elementId)
    );
};
renderApp(App, appConfig, 'app');

// Only chrome allowed till workbox 4 is out
if (isChrome(false)) {
    registerServiceWorker({
        onSuccess: (registration) => {},
        onUpdate: (registration) => {},
    });
} else {
    unregisterServiceWorker();
}
