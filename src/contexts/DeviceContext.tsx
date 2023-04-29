// Device context that take care of the connection between firebase and the API
import React, { createContext, useContext, FC } from "react";
import {
  getFirestore,
  doc,
  onSnapshot,
  DocumentSnapshot,
  collection,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { IGroup } from "../components/views/GroupContainer.view";

// API ENDPOINTS, ARE DEFINED IN .env
const API_ENDPOINT_UPDATE_DEVICE = process.env.API_ENDPOINT_UPDATE_DEVICE || "";
const API_ENDPOINT_GROUPS = process.env.API_ENDPOINT_GROUPS || "";
const API_ENDPOINT_ROUTINES = process.env.API_ENDPOINT_ROUTINES || "";

/** Interface for Devices */
export interface IDevice {
  id: string;
  state: IState;
  type: string;
  name?: string;
  tag?: string;
}

/** Interface for state of toggle */
export interface IState {
  on?: boolean;
  open?: boolean;
  locked?: boolean;
  text?: string;
  tune?: string;
  reverse?: boolean;
}

export interface IRoutine {
  id?: string;
  name: string;
  description: string;
  schedule: string;
  repeatable: boolean;
  enabled: boolean;
  actions: {
    id: string;
    type: "toggle" | "openLock" | "fan" | "screen" | "buzzer";
    state: Record<string, string | boolean>;
  }[];
}

export interface IAction {
  deviceId: string;
  state: IState; // The state of the device, e.g. {on: true}, {open: true}, {locked: true}, {text: "Hello World"}, {tune: "C4"}, {reverse: true}
  type: string; // The type of the device, e.g. "toggle", "openLock", "fan", "screen", "buzzer"
}

/** Interface for the DeviceContext */ export interface IDeviceContext {
  startListening: (
    deviceId: string,
    onUpdate: { (data: IDevice | null): void }
  ) => void;
  updateDevice: (device: IDevice, token: string) => void;
  getAllDevices: (onGetDocuments: { (value: QuerySnapshot): void }) => void;
  getGroupsFromEmail: (
    email: string,
    onGetDocuments: { (value: QuerySnapshot): void }
  ) => void;
  createGroup: (group: IGroup, token: string) => void;
  removeGroupById: (id: string, token: string) => void;
  createRoutine: (routine: IRoutine, token: string) => void;
  removeRoutineById: (id: string, token: string) => void;
  getAllRoutines: (onGetDocuments: { (value: QuerySnapshot): void }) => void;
  getRoutinesFromEmail: (
    email: string,
    onGetDocuments: { (value: QuerySnapshot): void }
  ) => void;
  editRoutines: (
    routines: IRoutine[],
    token: string,
    onEdit: { (value: boolean): void }
  ) => void;
}

// Init the device context
const DeviceContext = createContext<IDeviceContext>({
  startListening: function (
    _deviceId: string,
    _onUpdate: (data: IDevice | null) => void
  ): void {
    throw new Error("Function not implemented.");
  },
  updateDevice: function (_device: IDevice, _token: string): void {
    throw new Error("Function not implemented.");
  },
  getAllDevices: function (
    _onGetDocuments: (value: QuerySnapshot<DocumentData>) => void
  ): void {
    throw new Error("Function not implemented.");
  },
  getGroupsFromEmail: function (
    _email: string,
    _onGetDocuments: (value: QuerySnapshot<DocumentData>) => void
  ): void {
    throw new Error("Function not implemented.");
  },
  createGroup: function (_group: IGroup, _token: string): void {
    throw new Error("Function not implemented.");
  },
  removeGroupById: function (_id: string, _token: string): void {
    throw new Error("Function not implemented.");
  },
  createRoutine: function (_routine: IRoutine, _token: string): void {
    throw new Error("Function not implemented.");
  },
  removeRoutineById: function (_id: string, _token: string): void {
    throw new Error("Function not implemented.");
  },
  getAllRoutines: function (
    _onGetDocuments: (value: QuerySnapshot<DocumentData>) => void
  ): void {
    throw new Error("Function not implemented.");
  },
  getRoutinesFromEmail: function (
    _email: string,
    _onGetDocuments: (value: QuerySnapshot<DocumentData>) => void
  ): void {
    throw new Error("Function not implemented.");
  },
  editRoutines: function (
    _routines: IRoutine[],
    _token: string,
    _onEdit: (value: boolean) => void
  ): void {
    throw new Error("Function not implemented.");
  },
});

/** DeviceContextProvider */
export const DeviceContextProvider: FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  /** Call the API to update a device */
  const updateDevice = (device: IDevice, token: string) => {
    console.log("Sending to server: " + JSON.stringify(device));
    fetch(API_ENDPOINT_UPDATE_DEVICE, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-header": token,
      },
      body: JSON.stringify(device),
    }).then((res: Response) => {
      console.log(res);
    });
  };

  /** Start listening on a device based on its ID, returns the updated version of the document using a callback. */
  const startListening = (
    deviceId: string,
    onUpdate: (data: IDevice | null) => void
  ) => {
    const db = getFirestore();
    const ref = doc(db, `devices/${deviceId}`);
    onSnapshot(ref, (snap: DocumentSnapshot) => {
      const device: IDevice = {
        id: deviceId,
        state: snap.data()?.state,
        type: snap.data()?.type,
        name: snap.data()?.name,
      };
      console.log("Retrieving from firebase: " + JSON.stringify(device));
      onUpdate(device);
    });
  };

  const getAllDevices = (onGetDocuments: (value: QuerySnapshot) => void) => {
    // Get all documents in a collection
    const db = getFirestore();
    const ref = collection(db, "devices");
    getDocs(ref).then((value: QuerySnapshot) => {
      onGetDocuments(value);
    });
  };
  // Groups
  const getGroupsFromEmail = (
    email: string,
    onGetDocuments: (value: QuerySnapshot) => void
  ) => {
    const db = getFirestore();
    const ref = collection(db, `profiles/${email}/groups`);
    getDocs(ref).then((value: QuerySnapshot) => {
      onGetDocuments(value);
    });
  };

  const createGroup = (group: IGroup, token: string) => {
    console.log("Sending to server: " + JSON.stringify(group));
    fetch(API_ENDPOINT_GROUPS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-header": token,
      },
      body: JSON.stringify(group),
    }).then((res: Response) => {
      console.log(res);
    });
  };

  const removeGroupById = (id: string, token: string) => {
    fetch(API_ENDPOINT_GROUPS + "/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-header": token,
      },
    }).then((res: Response) => {
      console.log(res);
    });
  };

  // Routines
  const createRoutine = (routine: IRoutine, token: string) => {
    console.log("Sending to server: " + JSON.stringify(routine));
    fetch(API_ENDPOINT_ROUTINES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-header": token,
      },
      body: JSON.stringify(routine),
    }).then((res: Response) => {
      console.log(res);
    });
  };

  const removeRoutineById = (id: string, token: string) => {
    fetch(API_ENDPOINT_ROUTINES + "/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-header": token,
      },
    }).then((res: Response) => {
      console.log(res);
    });
  };

  const getAllRoutines = (onGetDocuments: (value: QuerySnapshot) => void) => {
    // Get all documents in a collection
    const db = getFirestore();
    const ref = collection(db, "routines");
    getDocs(ref).then((value: QuerySnapshot) => {
      onGetDocuments(value);
    });
  };

  const getRoutinesFromEmail = (
    email: string,
    onGetDocuments: (value: QuerySnapshot) => void
  ) => {
    const db = getFirestore();
    const ref = collection(db, `profiles/${email}/routines`);
    getDocs(ref).then((value: QuerySnapshot) => {
      onGetDocuments(value);
    });
  };

  const editRoutines = (
    routines: IRoutine[],
    token: string,
    onEdit: (value: boolean) => void
  ) => {
    console.log("Sending to server: " + JSON.stringify(routines));
    fetch(API_ENDPOINT_ROUTINES, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-header": token,
      },
      body: JSON.stringify(routines),
    }).then((res: Response) => {
      console.log(res);
      onEdit(res.ok);
    });
  };

  // Returning the context
  return (
    <DeviceContext.Provider
      value={{
        // Defining the data that is passed down
        startListening,
        updateDevice,
        getAllDevices,
        getGroupsFromEmail,
        createGroup,
        removeGroupById,
        createRoutine,
        removeRoutineById,
        getAllRoutines,
        getRoutinesFromEmail,
        editRoutines,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

/** Import this method to fetch the context in other components */
export const useDeviceContext = () => useContext<IDeviceContext>(DeviceContext);
