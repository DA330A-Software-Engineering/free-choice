/** Defines the FirebaseConfig interface */
export interface IFirebaseConfig {
    apiKey: string,
    authDomain: string,
    projectId: string,
    databaseURL: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string
};

/** Firebase Configuration */
// TODO: Add this to .env
export const FirebaseConfig: IFirebaseConfig = {
    apiKey: "AIzaSyAuwWteY_G2oNeECTVat__bdBiKDG4wapA",
    authDomain: "se-project-6d6d4.firebaseapp.com",
    databaseURL: "https://se-project-6d6d4-default-rtdb.firebaseio.com",
    projectId: "se-project-6d6d4",
    storageBucket: "se-project-6d6d4.appspot.com",
    messagingSenderId: "175833709354",
    appId: "1:175833709354:web:2c735a14ab325cc73bbc53"
  };