import React from "react";

interface ScreenControlProps {
  state: any;
  onStateChange: (newState: any) => void;
}

const ScreenControl: React.FC<ScreenControlProps> = ({
  state,
  onStateChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStateChange({ text: e.target.value });
  };

  return (
    <div>
      <label>
        Screen text:
        <input type="text" value={state?.text || ""} onChange={handleChange} />
      </label>
    </div>
  );
};

export default ScreenControl;
