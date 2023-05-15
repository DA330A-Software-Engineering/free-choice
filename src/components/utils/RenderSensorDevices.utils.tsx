import React, { FC } from "react";
import SensorDevice from "../devices/SensorDevice.cmpt";
import { IDevice } from "../../contexts/DeviceContext";
import { faThermometerHalf } from "@fortawesome/free-solid-svg-icons";

type RenderSensorDevicesProps = {
  sensorDevices: IDevice[];
};

const RenderSensorDevices: FC<RenderSensorDevicesProps> = ({
  sensorDevices,
}) => {
  return (
    <div className="renderSensorDevicesContainer">
      {sensorDevices.map((device) => (
        <SensorDevice
          key={device.id}
          device={device}
          sensorIcon={faThermometerHalf}
        />
      ))}
    </div>
  );
};

export default RenderSensorDevices;
