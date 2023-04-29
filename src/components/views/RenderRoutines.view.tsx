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

  return (
    <>
      <h1>My Routines:</h1>
      {routines.map((routine: IRoutine, index: number) => (
        <div key={index} className="routineStyle">
          {editingRoutine?.id === routine.id ? (
            <>
              <input
                defaultValue={routine.name}
                onChange={(e) =>
                  setEditingRoutine({ ...editingRoutine, name: e.target.value }) //Scrapping the edit functionality.
                }
              />
              {/* Add inputs for other editable properties */}
              <button onClick={handleEditingRoutine}>Save</button>
              <button onClick={onCancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <h1>{routine.name}</h1>
              {/* Render other routine properties if necessary */}
              <button onClick={() => onEditRoutine(routine)}>Edit</button>
              <button onClick={() => onRemoveRoutine(routine.id)}>
                Remove
              </button>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default RenderRoutines;
