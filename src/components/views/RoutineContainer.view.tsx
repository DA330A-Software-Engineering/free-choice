import React, { FC, useState } from "react";
import CreateRoutineContainer from "./CreateRoutineContainer.view";
import RenderRoutines from "./RenderRoutines.view";
import { IRoutine } from "../../contexts/DeviceContext";

const RoutineContainer: FC = () => {
  const [editingRoutine, setEditingRoutine] = useState<IRoutine | null>(null);
  const [editKey, setEditKey] = useState(0); // Add this state

  // Modify this function
  const handleSetEditingRoutine = (routine: IRoutine | null) => {
    setEditingRoutine(routine);
    setEditKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="routine-container">
      <CreateRoutineContainer
        key={editKey}
        editingRoutine={editingRoutine}
        setEditingRoutine={handleSetEditingRoutine}
      />
      <RenderRoutines
        editingRoutine={editingRoutine}
        setEditingRoutine={handleSetEditingRoutine}
      />
    </div>
  );
};

export default RoutineContainer;
