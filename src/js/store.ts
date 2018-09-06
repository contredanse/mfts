import { createStore, compose, applyMiddleware } from 'redux';
import { rootReducer, RootState } from '@src/redux';

import { connectRouter, routerMiddleware } from 'connected-react-router';

import history from '@src/history';

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
          })
        : compose;

function configureStore(initialState?: RootState) {
    // configure middlewares
    const middlewares = [
        // createEpicMiddleware(rootEpic),
        //      thunk,
        routerMiddleware(history),
    ];

    // compose enhancers
    const enhancers = composeEnhancers(applyMiddleware(...middlewares));

    // create store
    return createStore(connectRouter(history)(rootReducer), initialState!, enhancers);
}

// pass an optional param to rehydrate state on app start
const store = configureStore();

// export store singleton instance
export default store;
