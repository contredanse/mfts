import React from 'react';
import { render } from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
// import { ConnectedRouter } from 'react-router-redux'
import store from './store';
import App from './containers/app';

import '@public/favicon.ico';
//import 'typeface-roboto';
import 'typeface-quicksand';

import '@styles/style.scss';

const renderApp = (Component: any, elementId: string) => {
    render(
        <ReduxProvider store={store}>
                <Component/>
        </ReduxProvider>,
        document.getElementById(elementId)
    );
};

renderApp(App, 'app');
