// keep the main scss at top of everything to help webpack
// mini-css-extract-plugin to place it of top of the bundled styles
import '@styles/style.scss';

// Not needed, we use useBuiltins: 'usage' instead
// import '@babel/polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import history from './history';

import App from './containers/app';

import '@public/favicon.ico';
import 'typeface-quicksand';
import 'typeface-raleway';
import 'typeface-shadows-into-light-two';

import { appConfig } from '@config/config.production';
import AppConfig from '@src/core/app-config';
import registerServiceWorker from './registerServiceWorker';

import configureStore from './configureStore';

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

registerServiceWorker();
