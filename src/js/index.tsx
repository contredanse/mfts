import React from 'react';
import { render } from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store';
import App from './containers/app';

import '@public/favicon.ico';
import 'typeface-quicksand';

import '@styles/style.scss';
import { appConfig, AppConfig } from '@config/app-config';

const renderApp = (Component, config: AppConfig, elementId: string) => {
    render(
        <ReduxProvider store={store}>
            <Component appConfig={config} />
        </ReduxProvider>,
        document.getElementById(elementId),
    );
};
//console.log('appConfig', appConfig);
renderApp(App, appConfig, 'app');
