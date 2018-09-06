import { Action, AnyAction, combineReducers, Dispatch } from 'redux';
import counterReducer from './reducers/counter';

// The top-level state object
//
// `connected-react-router` already injects the router state typings for us,
// so we can ignore them here.
export interface RootState {
    count: number;
}

// Additional props for connected React components. This prop is passed by default with `connect()`
export interface ConnectedReduxProps<A extends Action = AnyAction> {
    dispatch: Dispatch<A>;
}

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export const rootReducer = combineReducers<RootState>({
    count: counterReducer,
});
