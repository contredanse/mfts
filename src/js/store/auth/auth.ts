import { Dispatch } from 'redux';
import wretch from 'wretch';
import { appConfig } from '@config/config';

import * as authActions from './actions';
import { AuthErrorPayload } from '@src/store/auth/types';

export const AUTH_TOKEN_LOCALSTORAGE_KEY = 'user.token';

export type AuthCredentials = {
    email: string;
    password: string;
};

export type PayloadAction = {
    type: string;
    payload?: any;
};

export type AuthSignupCredentials = {
    passwordConfirm: string;
} & AuthCredentials;

export type AuthResponse = {
    access_token: string;
};

export type AuthUser = {
    email: string;
    token: string;
};

// default options
const wretchRequest = wretch()
    .options({ credentials: 'include', mode: 'cors' })
    .options({ headers: { Accept: 'application/json' } });

const baseUrl = appConfig.getApiBaseUrl();

export const loginUser = ({ email, password }: AuthCredentials, onSuccess?: (data: AuthResponse) => void) => {
    return (dispatch: Dispatch) => {
        dispatch(authActions.authFormSubmitRequest());

        return (
            wretchRequest
                .url(`http://qsdkjlkjqslkdjlkqjsldkjqs.com/auth/token`)
                //.url(`${baseUrl}/auth/token`)
                .options({ mode: 'cors' })
                .post({
                    email: email,
                    password: password,
                    language: window.navigator.language || '',
                })
                .json(response => {
                    const data = response as AuthResponse;
                    const { access_token } = data;
                    dispatch(authActions.authFormSubmitSuccess());
                    dispatch(
                        authActions.authenticateUser({
                            email,
                            token: access_token,
                        })
                    );
                    localStorage.setItem(AUTH_TOKEN_LOCALSTORAGE_KEY, access_token);
                    if (onSuccess) {
                        onSuccess(data);
                    }
                })
                .catch(error => {
                    const errorText = 'text' in error ? error.text : error;
                    const errorPayload: AuthErrorPayload = {
                        message: 'Unknown error',
                        expiryDate: null,
                    };
                    try {
                        const parsed = JSON.parse(errorText);
                        errorPayload.message = parsed.error_type;
                        // test expiry date
                        if (parsed.expired_date) {
                            errorPayload.expiryDate = parsed.expired_date;
                        }
                    } catch (e) {
                        const errorMsg = error.toString();
                        if (errorMsg.match(/fail(.*) to fetch|network/i)) {
                            errorPayload.message = 'fail.network';
                        } else {
                            errorPayload.message = errorMsg;
                        }
                    }
                    dispatch(authActions.authFormSubmitFailure(errorPayload));
                })
        );
    };
};

export const getUserProfile = (token?: string, onFailure?: (error: any) => void) => {
    return async (dispatch: Dispatch) => {
        const accessToken = token ? token : localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);
        await wretchRequest
            .url(`${baseUrl}/v1/profile`)
            .options({ headers: { Accept: 'application/json' } })
            .auth(`Bearer ${accessToken}`)
            .options({ mode: 'cors' })
            .get()
            .unauthorized(() => {
                console.log('401 Unauthorized, unauthenticating');
                dispatch(authActions.unAuthenticateUser());
            })
            .forbidden(() => {
                console.log('403 Forbidden');
                dispatch(authActions.unAuthenticateUser());
            })
            .json(response => {
                const { data } = response;
                const user: AuthUser = {
                    email: data.email,
                    token: accessToken!,
                };
                dispatch(authActions.authenticateUser(user));
            })
            .catch((error: any) => {
                dispatch(authActions.unAuthenticateUser());
                if (onFailure) {
                    onFailure(error);
                }
            });
    };
};

export const hasPersistedToken = (): boolean => {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);
    return token !== null;
};

export const logoutUser = (): PayloadAction => {
    localStorage.removeItem(AUTH_TOKEN_LOCALSTORAGE_KEY);
    return authActions.unAuthenticateUser();
};
