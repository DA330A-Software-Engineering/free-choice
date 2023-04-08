import { initializeApp } from 'firebase/app';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import ToggleDevice from '../devices/ToggleDevice.cmpt';
import { deviceContainerStyle } from './DeviceContainer.style';
import DoorDevice from '../devices/DoorDevice.cmpt';
import WindowDevice from '../devices/WindowDevice.cmpt';
import { faDoorClosed, faLock, faDoorOpen, faUnlock, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'

/** Props for this component */
type DeviceContainerProps = {}


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
          type: docData.type,
          name: docData.name
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
        return <ToggleDevice device={device} activceIcon={faToggleOn} unActivceicon={faToggleOff}/>;
      case 'window':
        return <WindowDevice device={device} windowOpenIcon={faDoorOpen} windowClosedIcon={faDoorClosed} lockIcon={faLock} unLockIcon={faUnlock} />;  // FontAwsome dosent have a window icon.
      case 'door':
        return <DoorDevice device={device} doorOpenIcon={faDoorOpen} doorClosedIcon={faDoorClosed} lockIcon={faLock} unLockIcon={faUnlock}  />;
      
      default:
        return null;
    }
  }


  return (
      <div>
        <div className={deviceContainerStyle}>
          {devices.map((device: IDevice, index: number) => 
            <div key={index}>
              {renderComponentFromDevice(device)}
            </div>
          )}
        </div>
      </div>
  )
}


// Export the component
export default DeviceContainerView