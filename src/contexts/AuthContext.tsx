import React, {createContext, useContext, FC, useEffect} from 'react';
import useLocalStorage from '../utils/LocalStorage';

// API ENDPOINTS, ARE DEFINED IN .env
const API_ENDPOINT_AUTH = process.env.API_ENDPOINT_AUTH || '';
const API_ENDPOINT_LOGIN = process.env.API_ENDPOINT_LOGIN || '';
const API_ENDPOINT_SIGNUP = process.env.API_ENDPOINT_SIGNUP || '';

/** Authentication methods callback */
interface MethodCallBack { (data: Response): void; };

/** User data definition */
export interface userData { jwt: string };

/** Defines the AuthenticationContext */
interface IAuthenticationContext {
    getUserData: () => userData;
    logout: (callback: MethodCallBack) => void,
    login: (email: string, password: string, callback: MethodCallBack) => void,
    signup: (email: string, firstname: string, lastname: string, password: string, callback: MethodCallBack) => void
};

/** Initiate the context */
const AuthenticationContext = createContext<IAuthenticationContext>({
    login: () => null,
    logout: () => null,
    signup: () => null,
    getUserData: () => ({} as any) as userData
});

/** Defines the custom AuthenticationProvider and its methods */
export const AuthenticationProvider: FC<{children: React.ReactElement}> = ({children}) => {

    // Stores the user information
    const [user, SetUser] = useLocalStorage("userData");

    // On component load, verify the authentication
    useEffect(() => fetchUser(() => null), []);

    /** Verify/Fetches the users data */
    const fetchUser = (callback: () => void) => {
        var success = false;
        var resp: Response;
        fetch(API_ENDPOINT_AUTH as string)
        .then(res => {
            resp = res;
            if (res.status === 504) console.log('Unable to reach the backend, ' + res.statusText);
            success = res.ok;
            return res.json()
        })
        .then(data => {
            console.log(data);
            if(success) SetUser(data);
            else SetUser(null);
            callback();
        });
    }

    /** Login the user using email and password */
    const login = (email: string, password: string, callback: MethodCallBack) => {
        fetch(API_ENDPOINT_LOGIN,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        }).then((res: Response) => callback(res));
    };

    /** Signup a user */
    const signup = (email: string, firstname: string, lastname: string, password: string, callback: MethodCallBack) => {
        fetch(API_ENDPOINT_SIGNUP,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "email": email,
                "firstName": firstname,
                "lastName": lastname,
                "password": password
            })
        }).then((res: Response) => callback(res));
    };

    /** Logout the authenticated user */
    const logout = (callback: MethodCallBack) => {
        fetch('/api/auth/logout')
        .then((res: Response) => {
            SetUser(null);
            callback(res);
        });
    };

    /** Data that is being passed down the context */
    const value = {
        login,
        logout,
        signup,
        getUserData: () => user as userData
    }

    return (
        <AuthenticationContext.Provider value={value}>
            {children}
        </AuthenticationContext.Provider>
    );
}

/** Import this method to fetch the context in other components */
export const useAuth = () => useContext<IAuthenticationContext>(AuthenticationContext);