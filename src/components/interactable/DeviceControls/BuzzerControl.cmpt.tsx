import React from "react";

interface BuzzerControlProps {
  state: any;
  onStateChange: (newState: any) => void;
}

const BuzzerControl: React.FC<BuzzerControlProps> = ({
  state,
  onStateChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStateChange({ tune: e.target.value });
  };

  return (
    <div>
      <label>
        Buzzer input:
        <select value={state?.tune || ""} onChange={handleChange}>
          <option value="">Select a tune...</option>
          <option key="alarm" value="alarm">
            Alarm
          </option>
          <option key="pirate" value="pirate">
            Pirates of the Caribbean
          </option>
          <option key="pokemon" value="pokemon">
            Pokemon Theme
          </option>
        </select>
      </label>
    </div>
  );
};

export default BuzzerControl;
