import React, {createContext, useContext, FC, useEffect} from 'react';
import useLocalStorage from '../utils/LocalStorage';
import jwt from 'jwt-decode'


// API ENDPOINTS, ARE DEFINED IN .env
const API_ENDPOINT_AUTH = process.env.API_ENDPOINT_AUTH || '';
const API_ENDPOINT_LOGIN = process.env.API_ENDPOINT_LOGIN || '';
const API_ENDPOINT_SIGNUP = process.env.API_ENDPOINT_SIGNUP || '';


export interface IAPIResponse {
    code: number
    msg: string
    token: string | null
}

/** Defines the AuthenticationContext */
interface IAuthenticationContext {
    logout: (callback: { (data: IAPIResponse): void; }) => void,
    login: (email: string, password: string, callback: { (data: IAPIResponse): void; }) => void,
    signup: (name: string, email: string, password: string, callback: { (data: IAPIResponse): void; }) => void,
    getToken: () => string | null,
    getEmail: () => string
};


/** Initiate the context */
const AuthenticationContext = createContext<IAuthenticationContext>({
    login: () => null,
    logout: () => null,
    signup: () => null,
    getToken: () => null,
    getEmail: () => ""
});


/** Defines the custom AuthenticationProvider and its methods */
export const AuthenticationProvider: FC<{children: React.ReactElement}> = ({children}) => {


    // Stores the user information
    const [token, SetToken] = useLocalStorage("token");

    // On component load, verify the authentication
    useEffect(() => fetchUser(() => null), []);

    /** Verify/Fetches the users data */
    const fetchUser = (callback: () => void) => {
        var success = false;
        var resp: Response;
        fetch(API_ENDPOINT_AUTH, {
            method: 'GET',
            headers: { 'x-auth-header': token },
        }).then(res => {
            resp = res;
            if (res.status === 504) console.log('Unable to reach the backend, ' + res.statusText);
            success = res.ok;
            return res.json()
        })
        .then(data => {
            if(success) SetToken(data.token);
            else SetToken(null);
            callback();
        });
    }


    /** Login the user using email and password */
    const login = (email: string, password: string, callback: { (data: IAPIResponse): void; }) => {
        fetch(API_ENDPOINT_LOGIN,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        }).then((res: Response) => resolveResponse(res, callback));
    };


    /** Signup a user */
    const signup = (name: string, email: string, password: string, callback: { (data: IAPIResponse): void; }) => {
        fetch(API_ENDPOINT_SIGNUP,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "name": name,
                "email": email,
                "password": password
            })
        }).then((res: Response) => resolveResponse(res, callback));
    };


    /** Logout the authenticated user */
    const logout = (callback: { (data: IAPIResponse): void; }) => {
        fetch('/api/auth/logout')
        .then((res: Response) => {
            SetToken(null);
            resolveResponse(res, callback);
        });
    };

    /** Get Email from token */
    const getEmail = (): string =>{
        const decoded = jwt(token) as { email: string, iat: number };
        if (decoded) {
            const email = decoded.email;
            return email;
        }
        return ""
    }


    /** Resolve response and map it into an IAPIResponse */
    const resolveResponse = (res: Response, callback: { (data: IAPIResponse): void; }) => {

        // TODO: Make sure we phrase the data from the API correctly
        // This is the only function we need to change

        var apiResponse: IAPIResponse = {
            code: res.status,
            msg: '',
            token: null
        }

        res.json().then(json => {
            console.log(json)
            apiResponse.token = json.token
            apiResponse.msg = json.error as string
        }).finally(() => {
            if (apiResponse.code == 200) {
                console.log(apiResponse.token)
                SetToken(apiResponse.token)
            }
            callback(apiResponse)
        });
    }

    /** Data that is being passed down the context */
    const value = {
        login,
        logout,
        signup,
        getToken: () => token as string,
        getEmail
    }

    return (
        <AuthenticationContext.Provider value={value}>
            {children}
        </AuthenticationContext.Provider>
    );
}

/** Import this method to fetch the context in other components */
export const useAuth = () => useContext<IAuthenticationContext>(AuthenticationContext);