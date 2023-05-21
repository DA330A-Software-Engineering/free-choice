import React, { FC, useState, ChangeEvent, FormEvent } from "react";
import {
  ITrigger,
  IDevice,
  IAction,
  IState,
  useDeviceContext,
} from "../../contexts/DeviceContext";
import { useAuth } from "../../contexts/AuthContext";

interface ITriggerFormProps {
  createTrigger: (trigger: ITrigger, token: string) => void;
  sensorDevices: IDevice[];
  actionDevices: IDevice[];
  token: string;
}

const initialState: ITrigger = {
  id: "",
  deviceId: "",
  name: "",
  description: "",
  condition: "grt",
  value: "",
  resetValue: "",
  enabled: true,
  actions: [],
};

const getInputType = (value: any): string => {
  if (typeof value === "boolean") {
    return "checkbox";
  }
  return "text";
};

const TriggerForm: FC<ITriggerFormProps> = ({
  createTrigger,
  sensorDevices,
  actionDevices,
  token,
}) => {
  const [trigger, setTrigger] = useState<ITrigger>(initialState);
  const [selectedActionDevices, setSelectedActionDevices] = useState<
    (IDevice | null)[]
  >([]);
  const [actionStates, setActionStates] = useState<Partial<IState>[]>([]);
  const deviceTypes = [...new Set(actionDevices.map((device) => device.type))];
  const deviceContext = useDeviceContext();
  const auth = useAuth();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTrigger((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleActionDeviceChange = (
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const deviceId = e.target.value;
    const selectedDevice = actionDevices.find(
      (device) => device.id === deviceId
    );

    setSelectedActionDevices((prev) => {
      const copy = [...prev];
      copy[index] = selectedDevice || null;
      return copy;
    });

    setTrigger((prevState) => {
      const updatedActions = [...prevState.actions];
      updatedActions[index].id = deviceId;

      // if the selectedDevice exists, set the type of the action to be the type of the selected device
      if (selectedDevice) {
        updatedActions[index].type = selectedDevice.type;
      }

      return { ...prevState, actions: updatedActions };
    });
  };

  const handleActionStateChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    stateKey: string
  ) => {
    const { value, type } = e.target;
    const parsedValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setActionStates((prevStates) => {
      const newState = [...prevStates];
      newState[index] = { ...newState[index], [stateKey]: parsedValue };
      return newState;
    });

    setTrigger((prevState) => {
      const updatedActions = [...prevState.actions];
      // directly use the newly updated state here
      updatedActions[index].state = {
        ...prevState.actions[index].state,
        [stateKey]: parsedValue,
      };

      return { ...prevState, actions: updatedActions };
    });
  };

  const handleActionTypeChange = (
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const type = e.target.value;

    setTrigger((prevState) => {
      const updatedActions = [...prevState.actions];
      updatedActions[index].type = type;
      return { ...prevState, actions: updatedActions };
    });
  };

  const addNewAction = () => {
    const newAction = {
      id: "", // Keep this empty for now, as it will be updated with the correct device ID later
      state: {},
      type: "",
    };

    setTrigger((prevState) => ({
      ...prevState,
      actions: [...prevState.actions, newAction],
    }));

    // Add a new slot for an action device without deleting previous selections.
    setSelectedActionDevices((prevSelectedActionDevices) => [
      ...prevSelectedActionDevices,
      null,
    ]);

    // Append a new state to the actionStates array.
    setActionStates((prev) => [...prev, {}]);
  };

  const removeAction = (index: number) => {
    setTrigger((prevState) => {
      const updatedActions = [...prevState.actions];
      updatedActions.splice(index, 1);
      return { ...prevState, actions: updatedActions };
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const newActions = trigger.actions.map((action, index) => {
      const selectedDevice = selectedActionDevices[index];
      const deviceType = selectedDevice?.type || "";
      const deviceId = selectedDevice?.id || "";

      return {
        id: deviceId,
        state: actionStates[index],
        type: deviceType,
      };
    });

    const newTrigger = {
      deviceId: trigger.deviceId,
      name: trigger.name,
      description: trigger.description,
      condition: trigger.condition,
      value: trigger.value,
      resetValue: trigger.resetValue,
      enabled: trigger.enabled,
      actions: newActions,
    };

    deviceContext.createTrigger(newTrigger, auth.getToken());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Sensor Device:</label>
        <select
          name="deviceId"
          value={trigger.deviceId}
          onChange={handleInputChange}
        >
          <option value="">Select a sensor</option>
          {sensorDevices &&
            sensorDevices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={trigger.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={trigger.description}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Condition:</label>
        <select
          name="condition"
          value={trigger.condition}
          onChange={handleInputChange}
        >
          <option value="grt">Greater Than</option>
          <option value="lsr">Lesser Than</option>
        </select>
      </div>
      <div>
        <label>Value:</label>
        <input
          type="text"
          name="value"
          value={trigger.value}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Reset Value:</label>
        <input
          type="text"
          name="resetValue"
          value={trigger.resetValue}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Enabled:</label>
        <input
          type="checkbox"
          name="enabled"
          checked={trigger.enabled}
          onChange={(e) =>
            setTrigger((prevState) => ({
              ...prevState,
              enabled: e.target.checked,
            }))
          }
        />
      </div>
      <div>
        <label>Actions:</label>
        {trigger.actions.map((action, index) => (
          <div key={index}>
            <label>Action {index + 1}:</label>
            <div>
              <label>Device</label>
              <select
                name="deviceId"
                value={action.deviceId}
                onChange={(e) => handleActionDeviceChange(e, index)}
              >
                <option value="">Select a device</option>
                {actionDevices &&
                  actionDevices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label>Device Type</label>
              <select
                name="type"
                value={action.type}
                onChange={(e) => handleActionTypeChange(e, index)}
              >
                <option value="">Select a type</option>
                {deviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>State:</label>
              {selectedActionDevices?.[index]?.state && actionStates[index]
                ? Object.entries(selectedActionDevices[index].state).map(
                    ([key, value]) => (
                      <div key={key}>
                        <label>{key}</label>
                        <input
                          type={getInputType(value)}
                          name={key}
                          value={actionStates[index][key]}
                          onChange={(e) =>
                            handleActionStateChange(e, index, key)
                          }
                        />
                      </div>
                    )
                  )
                : null}
            </div>
            <button type="button" onClick={() => removeAction(index)}>
              Remove Action
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addNewAction}>
        Add Action
      </button>
      <button type="submit">Create Trigger</button>
    </form>
  );
};

export default TriggerForm;
