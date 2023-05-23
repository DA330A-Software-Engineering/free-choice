import React from "react";

interface FanControlProps {
  state: any;
  onStateChange: (newState: any) => void;
}

const FanControl: React.FC<FanControlProps> = ({ state, onStateChange }) => {
  const handleOnToggle = () => {
    onStateChange({ ...state, on: !state?.on });
  };

  const handleReverseToggle = () => {
    onStateChange({ ...state, reverse: !state?.reverse });
  };

  return (
    <div>
      <button onClick={handleOnToggle}>
        {state?.on ? "Turn off" : "Turn on"}
      </button>
      <button onClick={handleReverseToggle}>
        {state?.reverse ? "Reverse off" : "Reverse on"}
      </button>
    </div>
  );
};

export default FanControl;
