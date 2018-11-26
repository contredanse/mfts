import { Reducer } from 'redux';
import { UiState, UiActionTypes } from './types';

// Type-safe initialState!
const initialState: UiState = {
    fullscreen: false,
    isMenuOpen: false,
    isIdleMode: false,
};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<UiState> = (state = initialState, action): UiState => {
    switch (action.type) {
        case UiActionTypes.SET_IN_FULLSCREEN: {
            return { ...state, fullscreen: action.payload };
        }
        case UiActionTypes.SET_IDLE_MODE: {
            return { ...state, isIdleMode: action.payload };
        }
        case UiActionTypes.SET_IS_MENU_OPEN: {
            return { ...state, isMenuOpen: action.payload };
        }
        case UiActionTypes.TOGGLE_MENU_OPEN: {
            return { ...state, isMenuOpen: !state.isMenuOpen };
        }
        default: {
            return state;
        }
    }
};

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as uiStateReducer };
