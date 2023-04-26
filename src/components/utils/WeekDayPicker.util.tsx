// WeekDayPicker.tsx

import React from 'react';

type WeekDayPickerProps = {
  selectedDays: Set<number>;
  onChange: (selectedDays: Set<number>) => void;
};

const WeekDayPicker: React.FC<WeekDayPickerProps> = ({ selectedDays, onChange }) => {
  const handleClick = (day: number) => {
    const newSelectedDays = new Set(selectedDays);
    if (selectedDays && selectedDays.has(day)) {
      newSelectedDays.delete(day);
    } else {
      newSelectedDays.add(day);
    }
    onChange(newSelectedDays);
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {days.map((day, index) => (
        <button
          key={index}
          style={{
            marginRight: 5,
            padding: '10px 20px',
            fontSize: '2rem',
            backgroundColor: selectedDays.has(index) ? '#007bff' : '',
            color: selectedDays.has(index) ? 'white' : '',
          }}
          onClick={() => handleClick(index)}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default WeekDayPicker;
