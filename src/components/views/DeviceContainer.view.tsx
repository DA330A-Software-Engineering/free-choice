import { initializeApp } from 'firebase/app';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { IDevice, IStateToggle, useDeviceContext } from '../../contexts/DeviceContext';
import ToggleDevice from '../devices/ToggleDevice.cmpt';

/** Props for this component */
type DeviceContainerProps = {}

const device: IDevice = {
  id: '1337',
  state: {
    on: false
  },
  type: ''
}

/** View containing all the devices */
const DeviceContainerView: FC<DeviceContainerProps> = () => {

  // State of devices
  const [devices, setDevices] = useState<IDevice[]>([]);

  // Init contexts
  const deviceContext = useDeviceContext()

  useEffect(() => {
    // Get all devices
    deviceContext.getAllDevices((value: QuerySnapshot) => {
      const data: IDevice[] = [];
      value.forEach((doc: QueryDocumentSnapshot) => {
        const docData = doc.data();
        let newDevice: IDevice = {
          id: doc.id,
          state: docData.state,
          type: docData.type
        } 
        data.push(newDevice)
      })
      setDevices(data);
    })
  }, [])


  /** Render right component from type */
  const renderComponentFromDevice = (device: IDevice) => {
    switch (device.type) {
      case 'toggle':
        return <ToggleDevice device={device} />;
      default:
        return null;
    }
  }


  return (
      <>
        <div>
          {devices.map((device: IDevice, index: number) => 
            <div key={index}>
              {renderComponentFromDevice(device)}
            </div>
          )}
        </div>
      </>
  )
}


// Export the component
export default DeviceContainerView