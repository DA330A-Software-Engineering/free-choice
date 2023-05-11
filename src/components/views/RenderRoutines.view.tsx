import React, { FC, useEffect, useState } from "react";
import { IRoutine } from "../../contexts/DeviceContext";
import { useDeviceContext } from "../../contexts/DeviceContext";
import { useAuth } from "../../contexts/AuthContext";
import { QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";

type RenderRoutinesProps = {
  editingRoutine: IRoutine | null;
  setEditingRoutine: (routine: IRoutine | null) => void;
};

const RenderRoutines: FC<RenderRoutinesProps> = ({
  editingRoutine,
  setEditingRoutine,
}) => {
  const [routines, setRoutines] = useState<IRoutine[]>([]);
  const deviceContext = useDeviceContext();
  const authContext = useAuth();

  // Pagination states and constants
  const [currentPage, setCurrentPage] = useState(0);
  const routinesPerPage = 4;

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
    deviceContext.updateRoutine(
      // Change this line
      editingRoutine,
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
  deviceContext.updateRoutine(
    // Change this line
    updatedRoutine,
    authContext.getToken() as string,
    (success) => {
      if (success) {
        setRoutines(
          routines.map((r) => (r.id === updatedRoutine.id ? updatedRoutine : r))
        );
      } else {
        console.error("Error updating routine");
      }
    }
  );
};


  // Pagination handler
  const handlePageChange = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <h1>My Routines:</h1>
      <div className="routine-grid">
        {routines
          .slice(
            currentPage * routinesPerPage,
            (currentPage + 1) * routinesPerPage
          )
          .map((routine: IRoutine, index: number) => (
            <div
              key={index}
              className={`routineStyle${
                routine.enabled ? " enabledRoutine" : ""
              }`}
            >
              <div className="routineHeader">
                <div className="nameAndStatus">
                  <h1>{routine.name}</h1>
                  <span
                    className={routine.enabled ? "activeText" : "inactiveText"}
                  >
                    {routine.enabled ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <p>
                    <i>{routine.description}</i>
                  </p>
                </div>
              </div>
              <button onClick={() => onEditRoutine(routine)}>Edit</button>
              <button onClick={() => onRemoveRoutine(routine.id)}>
                Remove
              </button>
              <button onClick={() => onToggleEnabled(routine)}>
                {routine.enabled ? "Disable" : "Enable"}
              </button>
            </div>
          ))}
      </div>
      <div className="pagination">
        <button
          disabled={currentPage === 0}
          onClick={() => handlePageChange("prev")}
        >
          Prev
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          disabled={(currentPage + 1) * routinesPerPage >= routines.length}
          onClick={() => handlePageChange("next")}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default RenderRoutines;
