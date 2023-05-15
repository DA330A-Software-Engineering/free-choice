import React, { FC, useEffect, useState } from "react";
import { IDevice, useDeviceContext } from "../../contexts/DeviceContext";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type SensorDeviceProps = {
  device: IDevice;
  sensorIcon: IconDefinition;
};

export const SensorDevice: FC<SensorDeviceProps> = ({ device, sensorIcon }) => {
  const { startListening } = useDeviceContext();
  const [sensorDevice, setSensorDevice] = useState<IDevice | null>(null);

  useEffect(() => {
    startListening(device.id, setSensorDevice);
  }, [device.id, startListening]);

  if (!sensorDevice) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{device.name}</p>
      <div className="deviceStyle sensorDeviceStyle">
        <div className="sensorValue">
          <p>{sensorDevice.sensorValue}</p>
          <FontAwesomeIcon icon={sensorIcon} />
        </div>
      </div>
    </div>
  );
};

export default SensorDevice;
