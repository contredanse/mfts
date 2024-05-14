import { appConfig } from '@config/config';

const login = (username: string, password: string): Promise<Response> => {
    console.log('Login attempt:', { username, password });
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    };

    return fetch(`${appConfig.getApiBaseUrl()}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            console.log('Response user data:', user);
            // login successful if there's a jwt token in the response
            if (user.token) {
                console.log('Login successful, storing user data in local storage');
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                console.log('Login failed, no token found in response');
            }
            return user;
        })
        .catch(error => {
            console.error('Login error:', error);
            throw error;
        });
};

const logout = (): void => {
    console.log('Logging out user');
    localStorage.removeItem('user');
};

const isLogged = (): any | null => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    console.log('Checking if user is logged in:', user);
    return user && user.token;
};

const handleResponse = (response: Response) => {
    console.log('Handling response:', response);
    return response.text().then(text => {
        console.log('Response text:', text);
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                console.log('401 Unauthorized response, logging out user');
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            console.error('Response error:', error);
            return Promise.reject(error);
        }
        console.log('Response data:', data);
        return data;
    });
};

export const userService = {
    login,
    logout,
    isLogged,
};
