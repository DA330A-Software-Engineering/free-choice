/** Defines the FirebaseConfig interface */
export interface IFirebaseConfig {
    apiKey: string,
    authDomain: string,
    projectId: string,
    databaseURL: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
};

/** Firebase Configuration */
// TODO: Add this to .env
export const FirebaseConfig: IFirebaseConfig = {
    apiKey: process.env.FIREBASE_CONFIG_apiKey || '',
    authDomain: process.env.FIREBASE_CONFIG_authDomain || '',
    databaseURL: process.env.FIREBASE_CONFIG_databaseURL || '',
    projectId: process.env.FIREBASE_CONFIG_projectId || '',
    storageBucket: process.env.FIREBASE_CONFIG_storageBucket || '',
    messagingSenderId: process.env.FIREBASE_CONFIG_messagingSenderId || '',
    appId: process.env.FIREBASE_CONFIG_appId || ''
}