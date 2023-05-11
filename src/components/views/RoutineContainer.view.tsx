import React, { FC, useState } from "react";
import CreateRoutineContainer from "./CreateRoutineContainer.view";
import RenderRoutines from "./RenderRoutines.view";
import { IRoutine } from "../../contexts/DeviceContext";

const RoutineContainer: FC = () => {
  const [editingRoutine, setEditingRoutine] = useState<IRoutine | null>(null);

  return (
    <div className="routine-container">
      <CreateRoutineContainer
        editingRoutine={editingRoutine}
        setEditingRoutine={setEditingRoutine}
      />
      <RenderRoutines
        editingRoutine={editingRoutine}
        setEditingRoutine={setEditingRoutine}
      />
    </div>
  );
};

export default RoutineContainer;
