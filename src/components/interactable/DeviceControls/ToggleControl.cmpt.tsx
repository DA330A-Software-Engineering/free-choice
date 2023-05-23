import React from "react";

interface ToggleControlProps {
  state: any;
  onStateChange: (newState: any) => void;
}

const ToggleControl: React.FC<ToggleControlProps> = ({
  state,
  onStateChange,
}) => {
  const handleOnToggle = () => {
    onStateChange({ on: !state?.on });
  };

  return (
    <div>
      <button onClick={handleOnToggle}>
        {state?.on ? "Turn off" : "Turn on"}
      </button>
    </div>
  );
};

export default ToggleControl;
