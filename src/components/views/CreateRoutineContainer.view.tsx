import React, { FC, useEffect, useState } from "react";
import { IDevice, IRoutine } from "../../contexts/DeviceContext";
import "@trendmicro/react-datepicker/dist/react-datepicker.css";
import "rc-time-picker/assets/index.css";
import moment from "moment";
import CustomTimePicker from "../utils/CustomTimePicker.util";
import WeekDayPicker from "../utils/WeekDayPicker.util";
import DeviceSelector from "../utils/DeviceSelector.util";
import { QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import { useDeviceContext } from "../../contexts/DeviceContext";
import OnScreenKeyboard from "../utils/OnScreenKeyBoard.util";
import Input from "../interactable/Input.cmpt";
import RenderRoutines from "./RenderRoutines.view";
import { Routine } from "../utils/types/Routine.utils";
import { useAuth } from "../../contexts/AuthContext";

const CreateRoutineContainer: FC = () => {
  const [selectedTime, setSelectedTime] = useState<moment.Moment | null>(null);
  const [devices, setDevices] = useState<IDevice[]>([]);
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set());
  const [selectedDevice, setSelectedDevice] = useState<IDevice | null>(null);
  const [routineName, setRoutineName] = useState("");
  const [newRoutineActions, setNewRoutineActions] = useState<
    Routine["actions"]
  >([]);
  const [routineDescription, setRoutineDescription] = useState("");
  const [routineEnabled, setRoutineEnabled] = useState(true);
  const [routineRepeatable, setRoutineRepeatable] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [focusedInput, setFocusedInput] = useState<
    "routineName" | "routineDescription" | null
  >(null);
  const [inputString, setInputString] = useState("");

  const { getAllDevices } = useDeviceContext();
  const auth = useAuth();
  const deviceContext = useDeviceContext();

  const fetchAllDevices = () => {
    getAllDevices((querySnapshot: QuerySnapshot) => {
      const devices = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...(doc.data() as Omit<IDevice, "id">),
      }));

      // Update the devices state
      setDevices(devices);
    });
  };

  useEffect(() => {
    fetchAllDevices();
  }, []);

  const handleDeviceStateChange = (updatedDevice: IDevice) => {
    setSelectedDevice(updatedDevice);

    const updatedActions = [...newRoutineActions];
    const actionIndex = updatedActions.findIndex(
      (action) => action.id === updatedDevice.id
    );

    if (actionIndex === -1) {
      updatedActions.push({
        id: updatedDevice.id,
        type: updatedDevice.type as
          | "toggle"
          | "openLock"
          | "fan"
          | "screen"
          | "buzzer",
        state: { ...updatedDevice.state },
      });
    } else {
      updatedActions[actionIndex].state = { ...updatedDevice.state };
    }

    setNewRoutineActions(updatedActions);
  };

  const handleWeekDayPickerChange = (updatedSelectedDays: Set<number>) => {
    setSelectedDays(updatedSelectedDays);
  };

  const handleTimeChange = (time: moment.Moment) => {
    setSelectedTime(time);
  };

  const updateInput = (inputValue: string) => {
    setInputString(inputValue);

    if (focusedInput === "routineName") {
      setRoutineName(inputValue);
    } else if (focusedInput === "routineDescription") {
      setRoutineDescription(inputValue);
    } else if (selectedDevice) {
      const updatedDevice = {
        ...selectedDevice,
        state: {
          ...selectedDevice.state,
          input: inputValue,
        },
      };
      handleDeviceStateChange(updatedDevice);
    }
  };

  const handleCreateRoutine = async () => {
    console.log("Creating routine...");
    console.log("selectedTime:", selectedTime);
    console.log("selectedDays:", selectedDays);
    console.log("selectedDevice:", selectedDevice);
    if (!selectedTime || selectedDays.size === 0 || !selectedDevice) {
      console.log("Missing required fields");
      return;
    }

    const selectedHour = selectedTime.get("hour");
    const selectedMinute = selectedTime.get("minute");

    const updatedActions = [...newRoutineActions];

    const daysOfWeek = Array.from(selectedDays).sort().join(",");
    const newRoutine: IRoutine = {
      name: routineName,
      description: routineDescription,
      enabled: routineEnabled,
      repeatable: routineRepeatable,
      schedule: `0 ${selectedMinute} ${selectedHour} * * ${daysOfWeek}`,
      actions: updatedActions,
    };

    try {
      console.log("Calling createRoutine function...");
      await deviceContext.createRoutine(newRoutine, auth.getToken() as string);
      console.log("Routine created successfully!");
    } catch (error) {
      console.error("Error creating routine:", error);
      return;
    }

    resetForm();
  };

  const resetForm = () => {
    setSelectedTime(null);
    setSelectedDays(new Set());
    setSelectedDevice(null);
    setRoutineName("");
    setNewRoutineActions([]);
    setRoutineDescription("");
    setRoutineEnabled(true);
    setRoutineRepeatable(true);
    setShowKeyboard(false);
  };

  return (
    <div className="routine-container">
      <div>
        <Input
          className="routine-input"
          placeholder="Routine Name"
          value={routineName}
          onChange={(value) => setRoutineName(value)}
          onFocus={() => {
            setFocusedInput("routineName");
            setInputString(routineName);
            setShowKeyboard(true);
          }}
        />
      </div>
      <div>
        <Input
          className="routine-input"
          placeholder="Routine Description"
          value={routineDescription}
          onChange={(value) => setRoutineDescription(value)}
          onFocus={() => {
            setFocusedInput("routineDescription");
            setInputString(routineDescription);
            setShowKeyboard(true);
          }}
        />
      </div>
      <DeviceSelector
        devices={devices}
        onDeviceSelected={handleDeviceStateChange}
        renderAsButtons={true}
      />

      <WeekDayPicker
        selectedDays={selectedDays}
        onChange={(selectedDays) => handleWeekDayPickerChange(selectedDays)}
      />
      {selectedDays.size > 0 && (
        <CustomTimePicker onChange={handleTimeChange} />
      )}
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
        <button className="routine-create-btn" onClick={handleCreateRoutine}>
          Create Routine
        </button>
      </div>
      {showKeyboard && (
        <div>
          <OnScreenKeyboard
            inputValue={inputString}
            onInput={updateInput}
            onBlur={() => setShowKeyboard(false)}
          />
          <RenderRoutines />
        </div>
      )}
    </div>
  );
};

export default CreateRoutineContainer;
