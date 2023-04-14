// Device context that take care of the connection between firebase and the API
import React, {createContext, useContext, FC, useEffect} from 'react';
import useLocalStorage from '../utils/LocalStorage';
import { getFirestore, doc, onSnapshot, DocumentSnapshot, collection, getDocs, getDoc, QuerySnapshot, QueryDocumentSnapshot, DocumentData} from "firebase/firestore"

// API ENDPOINTS, ARE DEFINED IN .env
const API_ENDPOINT_UPDATE_DEVICE = process.env.API_ENDPOINT_UPDATE_DEVICE || '';

/** Interface for Devices */
export interface IDevice {
    id: string,
    state: IState,
    type: string,
    name?: string
}

/** Interface for state of toggle */
export interface IState {
    on?: boolean;
    open?: boolean;
    locked?: boolean;
    text?: string;
    tune?: string;
}


/** Interface for the DeviceContext */
export interface IDeviceContext {
    startListening: (deviceId: string, onUpdate: {(data: IDevice | null): void}) => void,
    updateDevice: (device: IDevice, token: string) => void,
    getAllDevices: (onGetDocuments: {(value: QuerySnapshot): void}) => void
}


// Init the device context
const DeviceContext = createContext<IDeviceContext>({
    startListening: function (deviceId: string, onUpdate: (data: IDevice | null) => void): void {
        throw new Error('Function not implemented.');
    },
    updateDevice: function (device: IDevice, token: string): void {
        throw new Error('Function not implemented.');
    },
    getAllDevices: function (onGetDocuments: (value: QuerySnapshot<DocumentData>) => void): void {
        throw new Error('Function not implemented.');
    }
});


/** DeviceContextProvider */
export const DeviceContextProvider: FC<{children: React.ReactElement}> = ({children}) => {

    /** Call the API to update a device */
    const updateDevice = (device: IDevice, token: string) => {
        console.log("Sending to server: " + JSON.stringify(device));
        fetch(API_ENDPOINT_UPDATE_DEVICE,
            {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-header': token
                },
                body: JSON.stringify(device)
            }).then((res: Response) => {
                console.log(res);
            }
        );
    }

    /** Start listening on a device based on its ID, returns the updated version of the document using a callback. */
    const startListening = (deviceId: string, onUpdate: (data: IDevice | null) => void) => {
        const db = getFirestore();
        const ref = doc(db, `devices/${deviceId}`)
        onSnapshot(ref, (snap: DocumentSnapshot) => {
                const device: IDevice = {
                    id: deviceId,
                    state: snap.data()?.state,
                    type: snap.data()?.type,
                    name: snap.data()?.name
                }
                console.log("Retrieving from Firebase: " + JSON.stringify(device));
                onUpdate(device)
            }
        )
    }

    const getAllDevices = (onGetDocuments: (value: QuerySnapshot) => void) => {
        // Get all documents in a collection
        const db = getFirestore();
        const ref = collection(db, 'devices')
        getDocs(ref).then((value: QuerySnapshot) => {onGetDocuments(value)})
    }

    // Returning the context
    return (
        <DeviceContext.Provider value={
            {
                // Defining the data that is passed down
                startListening,
                updateDevice,
                getAllDevices
            }
        }>
            {children}
        </DeviceContext.Provider>
    );
}


/** Import this method to fetch the context in other components */
export const useDeviceContext = () => useContext<IDeviceContext>(DeviceContext);