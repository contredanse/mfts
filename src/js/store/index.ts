import { combineReducers, Dispatch, Action, AnyAction } from 'redux';
//import { all, fork } from 'redux-saga/effects'

import { uiLocaleReducer, LangState } from './locale';
import { navReducer, NavState } from './nav';

// The top-level state object
export interface ApplicationState {
    locale: LangState;
    nav: NavState;
}

// Additional props for connected React components. This prop is passed by default with `connect()`
export interface ConnectedReduxProps<A extends Action = AnyAction> {
    dispatch: Dispatch<A>;
}

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export const rootReducer = combineReducers<ApplicationState>({
    locale: uiLocaleReducer,
    nav: navReducer,
});

// Here we use `redux-saga` to trigger actions asynchronously. `redux-saga` uses something called a
// "generator function", which you can read about here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
//export function* rootSaga() {
//    yield all([fork(heroesSaga), fork(teamsSaga)])
//}
