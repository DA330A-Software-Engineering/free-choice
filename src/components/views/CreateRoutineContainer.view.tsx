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
import { Routine } from "../utils/types/Routine.utils";
import { useAuth } from "../../contexts/AuthContext";

interface CreateRoutineContainerProps {
  editingRoutine: IRoutine | null;
  setEditingRoutine: (routine: IRoutine | null) => void;
}

const CreateRoutineContainer: FC<CreateRoutineContainerProps> = ({
  editingRoutine,
  setEditingRoutine,
}) => {
  const [selectedTime, setSelectedTime] = useState<moment.Moment | undefined>(
    undefined
  );
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

  useEffect(() => {
    if (editingRoutine) {
      // Populate form fields with the data from editingRoutine
      setSelectedTime(moment(editingRoutine.schedule, "0 m H * * d"));
      setSelectedDays(
        new Set(editingRoutine.schedule.split(" ")[5].split(",").map(Number))
      );
      setRoutineName(editingRoutine.name);
      setNewRoutineActions(editingRoutine.actions);
      setRoutineDescription(editingRoutine.description);
      setRoutineEnabled(editingRoutine.enabled);
      setRoutineRepeatable(editingRoutine.repeatable);

      // Set selected device state
      if (editingRoutine.actions.length > 0) {
        const selectedDeviceId = editingRoutine.actions[0].id;
        const selectedDevice = devices.find(
          (device) => device.id === selectedDeviceId
        );
        setSelectedDevice(selectedDevice || null);
      }
    } else {
      resetForm();
    }
  }, [editingRoutine, devices]);
  useEffect(() => {
    if (editingRoutine && devices.length > 0) {
      // Set selected device state
      if (editingRoutine.actions.length > 0) {
        const selectedDeviceId = editingRoutine.actions[0].id;
        const selectedDevice = devices.find(
          (device) => device.id === selectedDeviceId
        );
        setSelectedDevice(selectedDevice || null);
      }
    }
  }, [editingRoutine, devices]);

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
    if (focusedInput === "routineName") {
      setRoutineName(inputValue);
    } else if (focusedInput === "routineDescription") {
      setRoutineDescription(inputValue);
    }
  };

  const handleCreateOrUpdateRoutine = async () => {
    console.log(editingRoutine ? "Updating routine..." : "Creating routine...");
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
      console.log(
        editingRoutine
          ? "Calling updateRoutine function..."
          : "Calling createRoutine function..."
      );
      if (editingRoutine) {
        await deviceContext.updateRoutine(
          { ...newRoutine, id: editingRoutine.id },
          auth.getToken() as string,
          (success: boolean) => {
            if (success) {
              console.log("Routine updated successfully!");
              setEditingRoutine(null);
            } else {
              console.log("Error updating routine.");
            }
          }
        );
      } else {
        await deviceContext.createRoutine(
          newRoutine,
          auth.getToken() as string
        );
        console.log("Routine created successfully!");
      }
    } catch (error) {
      console.error(
        editingRoutine ? "Error updating routine:" : "Error creating routine:",
        error
      );
      return;
    }

    resetForm();
  };

  const resetForm = () => {
    setSelectedTime(undefined);
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
      <Input
        className="routine-input"
        placeholder="Routine Name"
        value={routineName}
        onChange={(value) => setRoutineName(value)}
        onFocus={() => {
          setFocusedInput("routineName");
          setRoutineName(routineName);
          setShowKeyboard(true);
        }}
      />
      <Input
        className="routine-input"
        placeholder="Routine Description"
        value={routineDescription}
        onChange={(value) => setRoutineDescription(value)}
        onFocus={() => {
          setFocusedInput("routineDescription");
          setRoutineDescription(routineDescription);
          setShowKeyboard(true);
        }}
      />
      <DeviceSelector
        devices={devices}
        selectedDevice={selectedDevice}
        onDeviceSelected={handleDeviceStateChange}
        renderAsButtons={true}
      />

      <WeekDayPicker
        selectedDays={selectedDays}
        onChange={(selectedDays) => handleWeekDayPickerChange(selectedDays)}
      />
      {selectedDays.size > 0 && (
        <CustomTimePicker
          initialTime={selectedTime}
          onChange={handleTimeChange}
        />
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
        <button
          className="routine-create-btn"
          onClick={handleCreateOrUpdateRoutine}
        >
          {editingRoutine ? "Update Routine" : "Create Routine"}
        </button>
      </div>
      {showKeyboard && (
        <div>
          <OnScreenKeyboard
            key={focusedInput}
            inputValue={
              focusedInput === "routineName"
                ? routineName
                : focusedInput === "routineDescription"
                ? routineDescription
                : ""
            }
            onInput={updateInput}
            onBlur={() => setShowKeyboard(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CreateRoutineContainer;
