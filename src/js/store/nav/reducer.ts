import { Reducer } from 'redux';
import { NavState, NavActionTypes } from './types';

// Type-safe initialState!
const initialState: NavState = {};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<NavState> = (state = initialState, action): NavState => {
    switch (action.type) {
        case NavActionTypes.SET_NAV_BREADCRUMB: {
            return { ...state, navBreadcrumb: action.payload };
        }
        default: {
            return state;
        }
    }
};

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as navReducer };
