import { action } from 'typesafe-actions';

import { AuthActionTypes, AuthErrorPayload } from './types';
import { AuthUser } from '@src/store/auth/auth';

export const authenticateUser = (user: AuthUser) => action(AuthActionTypes.AUTHENTICATE_USER, user);
export const unAuthenticateUser = () => action(AuthActionTypes.UNAUTHENTICATE_USER);

export const resetAuthForm = () => action(AuthActionTypes.RESET_AUTH_FORM);

export const authFormSubmitRequest = () => action(AuthActionTypes.AUTH_FORM_SUBMIT_REQUEST);
export const authFormSubmitSuccess = () => action(AuthActionTypes.AUTH_FORM_SUBMIT_SUCCESS);
export const authFormSubmitFailure = (errorPayload: AuthErrorPayload) =>
    action(AuthActionTypes.AUTH_FORM_SUBMIT_FAILURE, errorPayload);
