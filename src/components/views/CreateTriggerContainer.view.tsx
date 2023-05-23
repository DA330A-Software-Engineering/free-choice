import React, { useContext, useState, useEffect } from "react";
import { IDevice } from "../../contexts/DeviceContext";
import { useDeviceContext } from "../../contexts/DeviceContext";
import TriggerForm from "../utils/TriggerForm.utils";
import { useAuth } from "../../contexts/AuthContext";

const CreateTriggerContainer: React.FC = () => {
  const { getAllDevices, createTrigger } = useDeviceContext();
  const [sensorDevices, setSensorDevices] = useState<IDevice[]>([]);
  const [actionDevices, setActionDevices] = useState<IDevice[]>([]);
  const auth = useAuth();

  useEffect(() => {
    getAllDevices((querySnapshot) => {
      const sensorDevices: IDevice[] = [];
      const actionDevices: IDevice[] = [];
      querySnapshot.forEach((doc) => {
        const deviceData = doc.data();
        const device: IDevice = {
          id: doc.id,
          state: deviceData.state,
          type: deviceData.type,
          name: deviceData.name,
          tag: deviceData.tag,
          sensorValue: deviceData.sensorValue,
          description: deviceData.description,
        };
        if (device.type === "sensor") {
          sensorDevices.push(device);
        } else {
          actionDevices.push(device); // Devices that are not sensors
        }
      });
      setSensorDevices(sensorDevices);
      setActionDevices(actionDevices);
    });
  }, [getAllDevices]);

  console.log("Sensor Devices:", sensorDevices); // Log the sensorDevices state here

  const token = auth.getToken();
  if (token === null) {
    // Handle the case when token is null
    return <div>Error: Token not available</div>;
  }

  return (
    <div className="createTriggerContainer">
      <TriggerForm
        sensorDevices={sensorDevices}
        actionDevices={actionDevices} // New prop
        createTrigger={createTrigger}
        token={token}
      />
    </div>
  );
};

export default CreateTriggerContainer;
