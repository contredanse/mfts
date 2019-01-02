import { Store, createStore, applyMiddleware, compose } from 'redux';

import { routerMiddleware } from 'connected-react-router';

import reduxThunk from 'redux-thunk';
import { ApplicationState, createRootReducer } from './store/index';
import { History } from 'history';

export default function configureStore(history: History, initialState: ApplicationState): Store<ApplicationState> {
    // create the composing function for our middlewares
    const composeEnhancers =
        (process.env.NODE_ENV === 'development' && window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

    const middlewares = [routerMiddleware(history), reduxThunk];

    // compose enhancers
    const enhancers = composeEnhancers(applyMiddleware(...middlewares));

    return createStore(createRootReducer(history), initialState, enhancers);
}
