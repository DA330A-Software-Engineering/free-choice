import React, { FC, useEffect, useState } from "react";
import { IRoutine } from "../../contexts/DeviceContext";
import { useDeviceContext } from "../../contexts/DeviceContext";
import { useAuth } from "../../contexts/AuthContext";
import { QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";

const RenderRoutines: FC = () => {
  const [routines, setRoutines] = useState<IRoutine[]>([]);
  const [editingRoutine, setEditingRoutine] = useState<IRoutine | null>(null);
  const deviceContext = useDeviceContext();
  const authContext = useAuth();

  useEffect(() => {
    deviceContext.getAllRoutines((querySnapshot) => {
      const fetchedRoutines: IRoutine[] = [];
      querySnapshot.forEach((doc) => {
        const routineData = doc.data() as IRoutine;
        fetchedRoutines.push({ ...routineData, id: doc.id });
      });
      setRoutines(fetchedRoutines);
    });

    const email = authContext.getEmail();
    deviceContext.getRoutinesFromEmail(email, (value: QuerySnapshot) => {
      const newRoutines: IRoutine[] = [];
      value.forEach((doc: QueryDocumentSnapshot) => {
        const routine = doc.data() as IRoutine;
        routine.id = doc.id;
        newRoutines.push(routine);
      });
      setRoutines(newRoutines);
    });
  }, [deviceContext, authContext]);

  const onRemoveRoutine = (id: string | undefined) => {
    if (id != undefined) {
      deviceContext.removeRoutineById(id, authContext.getToken() as string);
      setRoutines(routines.filter((routine) => routine.id !== id));
    }
  };

  const onEditRoutine = (routine: IRoutine) => {
    setEditingRoutine(routine);
  };

  const handleEditingRoutine = () => {
    if (editingRoutine) {
      deviceContext.editRoutines(
        [editingRoutine],
        authContext.getToken() as string,
        (success) => {
          if (success) {
            setRoutines(
              routines.map((routine) =>
                routine.id === editingRoutine?.id ? editingRoutine : routine
              )
            );
            setEditingRoutine(null);
          } else {
            console.error("Error updating routine");
          }
        }
      );
    }
  };

  const onCancelEdit = () => {
    setEditingRoutine(null);
  };

  const onToggleEnabled = (routine: IRoutine) => {
    const updatedRoutine = { ...routine, enabled: !routine.enabled };
    deviceContext.editRoutines(
      [updatedRoutine],
      authContext.getToken() as string,
      (success) => {
        if (success) {
          setRoutines(
            routines.map((r) =>
              r.id === updatedRoutine.id ? updatedRoutine : r
            )
          );
        } else {
          console.error("Error updating routine");
        }
      }
    );
  };

  return (
    <>
      <h1>My Routines:</h1>
      {routines.map((routine: IRoutine, index: number) => (
        <div
          key={index}
          className={`routineStyle${routine.enabled ? " enabledRoutine" : ""}`}
        >
          <div className="routineHeader">
            <div className="nameAndStatus">
              <h1>{routine.name}</h1>
              {/* Add a <span> tag to display the Active or Inactive text */}
              <span className={routine.enabled ? "activeText" : "inactiveText"}>
                {routine.enabled ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <p>
                <i>{routine.description}</i>
              </p>
            </div>
          </div>
          {/* Render other routine properties if necessary */}
          <button onClick={() => onEditRoutine(routine)}>Edit</button>
          <button onClick={() => onRemoveRoutine(routine.id)}>Remove</button>
          {/* Add a button to toggle the enabled property */}
          <button onClick={() => onToggleEnabled(routine)}>
            {routine.enabled ? "Disable" : "Enable"}
          </button>
        </div>
      ))}
    </>
  );
};

export default RenderRoutines;
