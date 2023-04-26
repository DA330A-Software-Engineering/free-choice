// CustomTimePicker.tsx

import React, { useState } from 'react';
import moment from 'moment';

interface ICustomTimePickerProps {
	onChange: (time: moment.Moment) => void;
	}

	const CustomTimePicker: React.FC<ICustomTimePickerProps> = ({ onChange }) => {
	const [time, setTime] = useState<moment.Moment>(moment());

	const increaseHour = () => {
		setTime(time.clone().add(1, 'hour'));
		onChange(time.clone().add(1, 'hour'));
	};

	const decreaseHour = () => {
		setTime(time.clone().subtract(1, 'hour'));
		onChange(time.clone().subtract(1, 'hour'));
	};

	const increaseMinute = () => {
		setTime(time.clone().add(1, 'minute'));
		onChange(time.clone().add(1, 'minute'));
	};

	const decreaseMinute = () => {
		setTime(time.clone().subtract(1, 'minute'));
		onChange(time.clone().subtract(1, 'minute'));
	};

 return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <button onClick={decreaseHour} style={{ padding: '10px 20px', fontSize: '1rem' }}>
          -
        </button>
        <div style={{ width: 50, textAlign: 'center', fontSize: '2rem' }}>{time.format('HH')}</div>
        <button onClick={increaseHour} style={{ padding: '10px 20px', fontSize: '1rem' }}>
          +
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={decreaseMinute} style={{ padding: '10px 20px', fontSize: '1rem' }}>
          -
        </button>
        <div style={{ width: 50, textAlign: 'center', fontSize: '2rem' }}>{time.format('mm')}</div>
        <button onClick={increaseMinute} style={{ padding: '10px 20px', fontSize: '1rem' }}>
          +
        </button>
      </div>
    </div>
  );
};

export default CustomTimePicker;
