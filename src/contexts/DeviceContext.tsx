// Device context that take care of the connection between firebase and the API
import React, {createContext, useContext, FC, useEffect} from 'react';
import useLocalStorage from '../utils/LocalStorage';
import { FirebaseConfig } from '../configs/FirebaseConfig';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, DocumentSnapshot} from "firebase/firestore"


/** Interface for Devices */
export interface IDevice {
    id: number,
    state: {},
    type: string
}


/** Interface for the DeviceContext */
export interface IDeviceContext {
    startListening: (deviceId: string, onUpdate: {(data: IDevice | null): void}) => void
}


// Init the device context
const DeviceContext = createContext<IDeviceContext>({
    startListening: function (deviceId: string, onUpdate: (data: IDevice | null) => void): void {
        throw new Error('Function not implemented.');
    }
});


/** DeviceContextProvider */
export const DeviceContextProvider: FC<{children: React.ReactElement}> = ({children}) => {

    // Stores the lates version of the firebase data
    const [data, SetData] = useLocalStorage("userData");

    // On component mount
    useEffect(() => {

        // Init firebase
        initializeApp(FirebaseConfig);

    }, []);

    /** Start listening on a device based on its ID, returns the updated version of the document using a callback. */
    const startListening = (deviceId: string, onUpdate: (data: IDevice | null) => void) => {
        const db = getFirestore();
        const ref = doc(db, `devices/${deviceId}`)
        onSnapshot(ref, (snap: DocumentSnapshot) => {
                onUpdate(snap.data() as IDevice)
            }
        )
    }

    // Returning the context
    return (
        <DeviceContext.Provider value={
            {
                // Defining the data that is passed down
                startListening
            }
        }>
            {children}
        </DeviceContext.Provider>
    );
}


/** Import this method to fetch the context in other components */
export const useDeviceContext = () => useContext<IDeviceContext>(DeviceContext);