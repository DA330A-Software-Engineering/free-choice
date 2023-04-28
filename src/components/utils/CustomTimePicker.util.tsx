// CustomTimePicker.tsx

import React, { useState } from "react";
import moment from "moment";

interface ICustomTimePickerProps {
  onChange: (time: moment.Moment) => void;
}

const CustomTimePicker: React.FC<ICustomTimePickerProps> = ({ onChange }) => {
  const [time, setTime] = useState<moment.Moment>(moment());

  const increaseHour = () => {
    setTime(time.clone().add(1, "hour"));
    onChange(time.clone().add(1, "hour"));
  };

  const decreaseHour = () => {
    setTime(time.clone().subtract(1, "hour"));
    onChange(time.clone().subtract(1, "hour"));
  };

  const increaseMinute = () => {
    setTime(time.clone().add(1, "minute"));
    onChange(time.clone().add(1, "minute"));
  };

  const decreaseMinute = () => {
    setTime(time.clone().subtract(1, "minute"));
    onChange(time.clone().subtract(1, "minute"));
  };

  return (
    <div className="custom-time-picker">
      <div className="time-picker-row">
        <button className="time-picker-button" onClick={decreaseHour}>
          -
        </button>
        <div className="time-picker-display">{time.format("HH")}</div>
        <button className="time-picker-button" onClick={increaseHour}>
          +
        </button>
      </div>
      <div className="time-picker-row">
        <button className="time-picker-button" onClick={decreaseMinute}>
          -
        </button>
        <div className="time-picker-display">{time.format("mm")}</div>
        <button className="time-picker-button" onClick={increaseMinute}>
          +
        </button>
      </div>
    </div>
  );
};

export default CustomTimePicker;
