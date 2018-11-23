import { Dispatch } from 'redux';
import wretch from 'wretch';
import { appConfig } from '@config/config';

import * as authActions from './actions';

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

        return wretchRequest
            .url(`${baseUrl}/auth/token`)
            .options({ mode: 'cors' })
            .post({
                email: email,
                password: password,
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
                const reason = 'reason' in error ? error.reason : '';
                dispatch(authActions.authFormSubmitFailure(`Login failed ${reason}`));
            });
    };
};

export const hasPersistedToken = (): boolean => {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);
    return token !== '';
};

export const logoutUser = (): PayloadAction => {
    localStorage.removeItem(AUTH_TOKEN_LOCALSTORAGE_KEY);
    return authActions.unAuthenticateUser();
};

/*
export const signupUser = ({ email, password }: AuthSignupCredentials, onSuccess?: () => void) => {
    return (dispatch: Dispatch<ApplicationState>) => {
        dispatch<Action>(authFormSubmitRequest);

        return apiPOST('/api/auth/signup/', {email, password})
            .then((data: IAuthResponse) => {
                dispatch<IAction>(authFormSubmitSuccess());
                dispatch<IAction>(authenticateUser());
                localStorage.setItem(AUTH_TOKEN_LOCALSTORAGE_KEY, data.token);
                onSuccess && onSuccess(data);
            })
            // TODO: catch only specific error
            .catch((err: any) => {
                dispatch<IAction>(authFormSubmitFailure('Signup failed, try again'));
            });
    }
};
*/
