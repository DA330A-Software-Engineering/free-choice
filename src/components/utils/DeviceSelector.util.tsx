import React, { FC, useState } from "react";
import { IDevice } from "../../contexts/DeviceContext";
import RenderComponentForRoutine from "./RenderComponentForRoutine.utils";

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

  if (renderAsButtons) {
    const handleClick = (device: IDevice) => {
      setSelectedDevice(device);
      onDeviceSelected(device);
    };

    return (
      <div className="device-selector">
        {devices.map((device) => (
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
        {selectedDevice && (
          <>
            <RenderComponentForRoutine
              device={selectedDevice}
              onStateChange={(newState: any) =>
                setSelectedDevice({
                  ...selectedDevice,
                  state: newState,
                })
              }
            />
          </>
        )}
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
        {selectedDevice && (
          <>
            <RenderComponentForRoutine
              device={selectedDevice}
              onStateChange={(newState: any) =>
                setSelectedDevice({
                  ...selectedDevice,
                  state: newState,
                })
              }
            />
          </>
        )}
      </>
    );
  }
};

export default DeviceSelector;
