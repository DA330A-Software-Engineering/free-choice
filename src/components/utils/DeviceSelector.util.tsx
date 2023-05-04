import React, { FC, useState } from "react";
import { IDevice } from "../../contexts/DeviceContext";
import BuzzerControl from "../interactable/DeviceControls/BuzzerControl.cmpt";
import FanControl from "../interactable/DeviceControls/FanControl.cmpt";
import OpenLockControl from "../interactable/DeviceControls/OpenLockControl.cmpt";
import ScreenControl from "../interactable/DeviceControls/ScreenControl.cmpt";
import ToggleControl from "../interactable/DeviceControls/ToggleControl.cmpt";
interface IDeviceSelectorProps {
  devices: IDevice[];
  onDeviceSelected: (selectedDevice: IDevice) => void;
  renderAsButtons?: boolean;
}

const DeviceSelector: FC<IDeviceSelectorProps> = ({
  devices,
  onDeviceSelected,
  renderAsButtons = false,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<IDevice | null>(null);
  const filteredDevices = devices.filter((device) => device.type !== "sensor");
  const renderControl = (device: IDevice) => {
    switch (device.type) {
      case "buzzer":
        return (
          <BuzzerControl
            state={device.state}
            onStateChange={(newState) => {
              setSelectedDevice({ ...device, state: newState });
              onDeviceSelected({ ...device, state: newState });
            }}
          />
        );
      case "screen":
        return (
          <ScreenControl
            state={device.state}
            onStateChange={(newState) => {
              setSelectedDevice({ ...device, state: newState });
              onDeviceSelected({ ...device, state: newState });
            }}
          />
        );
      case "fan":
        return (
          <FanControl
            state={device.state}
            onStateChange={(newState) => {
              setSelectedDevice({ ...device, state: newState });
              onDeviceSelected({ ...device, state: newState });
            }}
          />
        );
      case "openLock":
        return (
          <OpenLockControl
            state={device.state}
            onStateChange={(newState) => {
              setSelectedDevice({ ...device, state: newState });
              onDeviceSelected({ ...device, state: newState });
            }}
          />
        );
      case "toggle":
        return (
          <ToggleControl
            state={device.state}
            onStateChange={(newState) => {
              setSelectedDevice({ ...device, state: newState });
              onDeviceSelected({ ...device, state: newState });
            }}
          />
        );
      default:
        return null;
    }
  };

  if (renderAsButtons) {
    const handleClick = (device: IDevice) => {
      setSelectedDevice(device);
      onDeviceSelected(device);
    };

    return (
      <div className="device-selector">
        {filteredDevices.map((device) => (
          <button
            key={device.id}
            className={`device-button${
              selectedDevice && selectedDevice.id === device.id
                ? " selected"
                : ""
            }`}
            onClick={() => handleClick(device)}
          >
            {device.name}
          </button>
        ))}
        {selectedDevice && renderControl(selectedDevice)}
      </div>
    );
  } else {
    return (
      <>
        <select
          onChange={(e) => {
            const selectedIndex = e.target.selectedIndex;
            const selectedDevice =
              selectedIndex > 0 ? devices[selectedIndex - 1] : null;
            setSelectedDevice(selectedDevice);
            if (selectedDevice) {
              onDeviceSelected(selectedDevice);
            }
          }}
        >
          <option key={-1} value="">
            Select a device
          </option>
          {devices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
        {selectedDevice && renderControl ? renderControl(selectedDevice) : null}
      </>
    );
  }
};

export default DeviceSelector;
