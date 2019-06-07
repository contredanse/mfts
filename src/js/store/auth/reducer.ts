import { Reducer } from 'redux';
import { AuthState, AuthActionTypes, AuthErrorPayload } from './types';
import { hasPersistedToken } from '@src/store/auth/auth';

// Temp you had a token... all is good !
const initAuth = {
    authenticated: hasPersistedToken(),
};

// Type-safe initialState!
const initialState: AuthState = {
    authenticated: initAuth.authenticated,
    authError: null,
    authExpiry: null,
    browserErrorMsg: null,
    loading: false,
    user: null,
};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<AuthState> = (state = initialState, action): AuthState => {
    switch (action.type) {
        case AuthActionTypes.AUTHENTICATE_USER:
            return { ...state, authenticated: true, browserErrorMsg: null, user: action.payload };
        case AuthActionTypes.UNAUTHENTICATE_USER:
            // prevent unauthenticate while authenticating
            if (state.loading) {
                return state;
            }
            return { ...state, user: null, authenticated: false };
        case AuthActionTypes.RESET_AUTH_FORM:
            return { ...state, authError: null, authExpiry: null, browserErrorMsg: null, loading: false };
        case AuthActionTypes.AUTH_FORM_SUBMIT_REQUEST:
            return { ...state, loading: true };
        case AuthActionTypes.AUTH_FORM_SUBMIT_SUCCESS:
            return { ...state, loading: false, authError: null, browserErrorMsg: null, authExpiry: null };
        case AuthActionTypes.AUTH_FORM_SUBMIT_FAILURE:
            const { message, expiryDate, browserMsg } = action.payload as AuthErrorPayload;
            return {
                ...state,
                authenticated: false,
                user: null,
                loading: false,
                authError: message,
                browserErrorMsg: browserMsg || null,
                authExpiry: expiryDate,
            };
        default: {
            return state;
        }
    }
};

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as authStateReducer };
