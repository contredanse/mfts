import { action } from 'typesafe-actions';

import { AuthActionTypes } from './types';
import { AuthUser } from '@src/store/auth/auth';

// Here we use the `action` helper function provided by `typesafe-actions`.
// This library provides really useful helpers for writing Redux actions in a type-safe manner.
// For more info: https://github.com/piotrwitek/typesafe-actions
//
// Remember, you can also pass parameters into an action creator. Make sure to
// type them properly as well.

export const authenticateUser = (user: AuthUser) => action(AuthActionTypes.AUTHENTICATE_USER, user);
export const unAuthenticateUser = () => action(AuthActionTypes.UNAUTHENTICATE_USER);

export const resetAuthForm = () => action(AuthActionTypes.RESET_AUTH_FORM);

export const authFormSubmitRequest = () => action(AuthActionTypes.AUTH_FORM_SUBMIT_REQUEST);
export const authFormSubmitSuccess = () => action(AuthActionTypes.AUTH_FORM_SUBMIT_SUCCESS);
export const authFormSubmitFailure = (error: string) => action(AuthActionTypes.AUTH_FORM_SUBMIT_FAILURE, error);
