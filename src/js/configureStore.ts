import { Store, createStore, applyMiddleware, compose } from 'redux';

import { connectRouter, routerMiddleware } from 'connected-react-router';

// Import the state interface and our combined reducers/sagas.
//import { ApplicationState, rootReducer, rootSaga } from './store'
import { ApplicationState, rootReducer } from './store/index';
//import {RootState} from '@src/store';
import { History } from 'history';

//function configureStore(initialState?: RootState) {

export default function configureStore(history: History, initialState: ApplicationState): Store<ApplicationState> {
    // create the composing function for our middlewares
    const composeEnhancers =
        (process.env.NODE_ENV === 'development' && window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

    const middlewares = [routerMiddleware(history)];

    // compose enhancers
    const enhancers = composeEnhancers(applyMiddleware(...middlewares));

    // For SAGAS replace:
    // > import createSagaMiddleware from 'redux-saga'
    // > const sagaMiddleware = createSagaMiddleware()
    //const enhancers = composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware))

    const store = createStore(connectRouter(history)(rootReducer), initialState, enhancers);

    // Don't forget to run the root saga, and return the store object.
    // > sagaMiddleware.run(rootSaga)
    return store;
}
