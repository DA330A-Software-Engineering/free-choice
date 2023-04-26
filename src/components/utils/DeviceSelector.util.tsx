// DeviceSelector.tsx

import React, { FC, useState } from 'react';
import { IDevice } from '../../contexts/DeviceContext';

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
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  if (renderAsButtons) {
    const handleClick = (device: IDevice) => {
      setSelectedDeviceId(device.id);
      onDeviceSelected(device);
    };

    return (
      <div className="deviceSelector">
        {devices.map((device, index) => (
          <button
            key={index}
            className={`deviceButton${selectedDeviceId === device.id ? ' selected' : ''}`}
            onClick={() => handleClick(device)}
          >
            {device.name}
          </button>
        ))}
      </div>
    );
  } else {
    return (
      <select onChange={(e) => onDeviceSelected(devices[e.target.selectedIndex])}>
        <option key={-1} value="">
          Select a device
        </option>
        {devices.map((device, index) => (
          <option key={index} value={index}>
            {device.name}
          </option>
        ))}
      </select>
    );
  }
};

export default DeviceSelector;
