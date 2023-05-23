import React, { useEffect, useState } from "react";
import { useDeviceContext } from "../../contexts/DeviceContext";
import RenderSensorDevices from "../utils/RenderSensorDevices.utils";
import { IDevice } from "../../contexts/DeviceContext";

const SensorDevicesContainer: React.FC = () => {
  const { getAllDevices } = useDeviceContext();
  const [devices, setDevices] = useState<IDevice[]>([]);

  useEffect(() => {
    getAllDevices((snapshot) => {
      const devicesData = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as IDevice;
      });
      setDevices(devicesData);
    });
  }, [getAllDevices]);

  const sensorDevices = devices.filter((device) => device.type === "sensor");

  return (
    <div>
      <RenderSensorDevices sensorDevices={sensorDevices} />
    </div>
  );
};

export default SensorDevicesContainer;
