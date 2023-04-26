import React, { FC, useEffect, useState  } from 'react';
import RenderComponentForRoutine from '../utils/RenderComponentForRoutine.utils';
import { IDevice } from '../../contexts/DeviceContext';
import '@trendmicro/react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import { CronScheduler } from '../utils/CronScheduler.utils';
import CustomTimePicker from '../utils/CustomTimePicker.util';
import WeekDayPicker from '../utils/WeekDayPicker.util';
import DeviceSelector from '../utils/DeviceSelector.util';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { useDeviceContext } from '../../contexts/DeviceContext';



type Routine = {
  name: string;
  description: string;
  enabled: boolean;
  repeatable: boolean;
  schedule: string;
  actions: {
    id: string;
    type: "toggle" | "openLock" | "fan" | "screen" | "buzzer" ;
    state: Record<string, boolean | string>;
  }[];
};


const RoutineContainerView: FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<moment.Moment | null>(null);
  const [devices, setDevices] = useState<IDevice[]>([]); // Load devices from context or API
  const [routines, setRoutines] = useState<Routine[]>([]); // Load routines from context or API
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set());
  const [selectedDevice, setSelectedDevice] = useState<IDevice | null>(null);
  const [routineName, setRoutineName] = useState('');
  const [newRoutineActions, setNewRoutineActions] = useState<Routine['actions']>([]);
  const [routineDescription, setRoutineDescription] = useState('');
  const [routineEnabled, setRoutineEnabled] = useState(true);
  const [routineRepeatable, setRoutineRepeatable] = useState(true);

  const deviceContext = useDeviceContext();

    useEffect(() => {
    // Get all devices
    deviceContext.getAllDevices((value: QuerySnapshot) => {
      const data: IDevice[] = [];
      value.forEach((doc: QueryDocumentSnapshot) => {
        const docData = doc.data();
        let newDevice: IDevice = {
          id: doc.id,
          state: docData.state,
          type: docData.type,
          name: docData.name,
          tag: docData.tag,
        };
        data.push(newDevice);
      });
      setDevices(data);
    });
  }, []);



  const handleWeekDayPickerChange = (newSelectedDays: Set<number>) => { // Add this handler
    setSelectedDays(newSelectedDays);
  };

  const handleDeviceSelect = (device: IDevice) => {
    setSelectedDevice(device);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoutineName(event.target.value);
  };

  const handleTimeChange = (time: moment.Moment | null) => {
    setSelectedTime(time);
  };

  const handleDeviceStateChange = (device: IDevice, newState: any) => {
    let newAction = {
      id: device.id,
      type: device.type,
      state: {},
    };

    switch (device.type) {
      case "toggle":
        newAction.state = { on: newState };
        break;
      case "openLock":
        newAction.state = { open: newState.open, locked: newState.locked };
        break;
      case "fan":
        newAction.state = { on: newState.on, reverse: newState.reverse };
        break;
      case "screen":
        newAction.state = { text: newState.text };
        break;
      case "speaker":
        newAction.state = { tune: newState.tune };
        break;
      default:
        return;
    }
  };


  const handleCreateRoutine = () => {
    if (!selectedTime) return;
      const daysOfWeek = Array.from(selectedDays).join(",");
      const newRoutine = {
        name: routineName,
        description: routineDescription,
        enabled: routineEnabled,
        repeatable: routineRepeatable,
        schedule: `0 ${selectedTime?.minute()} ${selectedTime?.hour()} * * ${daysOfWeek}`,
        actions: newRoutineActions,
      };

      // Add the new routine to the list of routines
      setRoutines([...routines, newRoutine]);

      // Schedule the routine using CronScheduler
      const cronScheduler = CronScheduler.getInstance();
      newRoutine.actions.forEach((action) => {
        selectedDays.forEach((dayOfWeek) => {
          cronScheduler.createCronJob(
            dayOfWeek,
            selectedTime?.hour(),
            selectedTime?.minute(),
            () => {
              // Implement the device state change logic
              // For example, you can call your API to update the device state
              console.log(`Device ${action.id} is set to`, action.state);
            },
            action.id
          );
        });
      });

      // Reset newRoutineActions and input fields
      setNewRoutineActions([]);
      setRoutineName('');
      setRoutineDescription('');
      setRoutineEnabled(true);
      setRoutineRepeatable(true);
    };




  return (
    <div className="routine-container">
      <div>
        <input
          className="routine-input"
          type="text"
          placeholder="Routine Name"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
        />
        <input
          className="routine-input"
          type="text"
          placeholder="Routine Description"
          value={routineDescription}
          onChange={(e) => setRoutineDescription(e.target.value)}
        />
      </div>
      <DeviceSelector
        devices={devices}
        onDeviceSelected={(selectedDevice: IDevice) => setSelectedDevice(selectedDevice)}
        renderAsButtons={true}
      />
      <WeekDayPicker
        selectedDays={selectedDays}
        onChange={handleWeekDayPickerChange}
      />
      {selectedDays.size > 0 && (
        <CustomTimePicker
          onChange={handleTimeChange}
        />
      )}
      {selectedTime && selectedDevice &&
        <RenderComponentForRoutine
          device={selectedDevice}
          onStateChange={(newState: any) => handleDeviceStateChange(selectedDevice, newState)}
        />
      }
      {/* Render the WeekSchedule component with the list of routines */}
      <div>
        <label>
          Enabled
          <input
            type="checkbox"
            checked={routineEnabled}
            onChange={(e) => setRoutineEnabled(e.target.checked)}
          />
        </label>
        <label>
          Repeatable
          <input
            type="checkbox"
            checked={routineRepeatable}
            onChange={(e) => setRoutineRepeatable(e.target.checked)}
          />
        </label>
      </div>
      <div>
        <button className="routine-create-btn" onClick={handleCreateRoutine}>Create Routine</button>
      </div>
    </div>
  );
};

export default RoutineContainerView;

// TODO
// 1. Fix on-screen keyboard
// 2. Enable picking the state for the routine, must be 2x icons for Door, Window, Fan
// 3. Enable an input for the text to display on the screen-device
// 4. Enable picking a value for the Buzzer.
// 5. Integration testing
// 6. Styling