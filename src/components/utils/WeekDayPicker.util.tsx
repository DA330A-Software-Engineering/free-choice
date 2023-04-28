// WeekDayPicker.tsx

import React from "react";

type WeekDayPickerProps = {
  selectedDays: Set<number>;
  onChange: (selectedDays: Set<number>) => void;
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const WeekDayPicker: React.FC<WeekDayPickerProps> = ({
  selectedDays,
  onChange,
}) => {
  const handleClick = (day: number) => {
    const newSelectedDays = new Set(selectedDays);
    if (selectedDays && selectedDays.has(day)) {
      newSelectedDays.delete(day);
    } else {
      newSelectedDays.add(day);
    }
    onChange(newSelectedDays);
  };

  return (
    <div className="weekday-picker">
      {days.map((day, index) => (
        <button
          key={index}
          className={`weekday-picker-button ${
            selectedDays.has(index) ? "selected" : ""
          }`}
          onClick={() => handleClick(index)}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default WeekDayPicker;
