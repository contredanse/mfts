import { appConfig } from '@config/config';

const login = (username: string, password: string): Promise<Response> => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    };

    return fetch(`${appConfig.getApiBaseUrl()}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }
            return user;
        });
};

const logout = (): void => {
    localStorage.removeItem('user');
};

const isLogged = (): any | null => {
    const user = JSON.parse(localStorage.getItem('user') || '');
    return user && user.token;
};

const handleResponse = (response: Response) => {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
};

export const userService = {
    login,
    logout,
    isLogged,
};
