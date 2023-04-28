import React, { FC } from "react";
import CreateRoutineContainer from "./CreateRoutineContainer.view";
import RenderRoutines from "./RenderRoutines.view";

const RoutineContainer: FC = () => {
  return (
    <div className="routine-container">
      <CreateRoutineContainer />
      <RenderRoutines />
    </div>
  );
};

export default RoutineContainer;
