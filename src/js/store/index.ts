import { combineReducers, Dispatch, Action, AnyAction } from 'redux';

import { uiStateReducer, UiState } from './ui';
import { navReducer, NavState } from './nav';
import { AuthState, authStateReducer } from './auth';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';

// The top-level state object
export interface ApplicationState {
    // Should be, but there's a bug somewhere in typings
    // router: Reducer<RouterState, LocationChangeAction>;
    router: RouterState;
    ui: UiState;
    nav: NavState;
    auth: AuthState;
}

// Additional props for connected React components. This prop is passed by default with `connect()`
export interface ConnectedReduxProps<A extends Action = AnyAction> {
    dispatch: Dispatch<A>;
}

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.

export const createRootReducer = (history: History) =>
    combineReducers<ApplicationState>({
        router: connectRouter(history),
        ui: uiStateReducer,
        nav: navReducer,
        auth: authStateReducer,
    });

// Here we use `redux-saga` to trigger actions asynchronously. `redux-saga` uses something called a
// "generator function", which you can read about here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
//export function* rootSaga() {
//    yield all([fork(heroesSaga), fork(teamsSaga)])
//}
