// Use const enums for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.

import { AuthUser } from '@src/store/auth/auth';

export type AuthErrorPayload = {
    message: string;
    expiryDate: string | null;
};

export const enum AuthActionTypes {
    AUTHENTICATE_USER = '@@auth/AUTHENTICATE_USER',
    UNAUTHENTICATE_USER = '@@auth/UNAUTHENTICATE_USER',

    RESET_AUTH_FORM = '@@auth/RESET_AUTH_FORM',

    AUTH_FORM_SUBMIT_REQUEST = '@@auth/AUTH_FORM_SUBMIT_REQUEST',
    AUTH_FORM_SUBMIT_SUCCESS = '@@auth/AUTH_FORM_SUBMIT_SUCCESS',
    AUTH_FORM_SUBMIT_FAILURE = '@@auth/AUTH_FORM_SUBMIT_FAILURE',
}

export interface AuthState {
    readonly authenticated: boolean;
    readonly authError: string | null;
    readonly authExpiry: string | null;
    readonly loading: boolean;
    readonly user: null | AuthUser;
}
