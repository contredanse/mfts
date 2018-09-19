import { Reducer } from 'redux';
import { LangState, LangActionTypes } from './types';

const getInitialLanguage = (): string => {
    // from route
    if (document.location) {
        const matches = document.location.href.match(/\/(fr|en)\//);
        if (Array.isArray(matches)) {
            return matches[1];
        }
    }
    // from browser accept
    if ('language' in navigator && navigator.language.startsWith('fr')) {
        return 'fr';
    }
    // otherwise
    return 'en';
};

// Type-safe initialState!
const initialState: LangState = {
    lang: getInitialLanguage(),
};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<LangState> = (state = initialState, action): LangState => {
    switch (action.type) {
        case LangActionTypes.SET_UI_LANG: {
            return { ...state, lang: action.payload };
        }
        default: {
            return state;
        }
    }
};

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as langReducer };
