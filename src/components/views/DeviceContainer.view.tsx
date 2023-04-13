import { initializeApp } from 'firebase/app';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import ToggleDevice from '../devices/ToggleDevice.cmpt';
import DoorDevice from '../devices/DoorDevice.cmpt';
import WindowDevice from '../devices/WindowDevice.cmpt';
import { faDoorClosed, faLock, faDoorOpen, faUnlock, faToggleOn, faToggleOff, faPlay, faStopCircle } from '@fortawesome/free-solid-svg-icons'
import Button from '../interactable/Button.cmpt';
import { BrowserRouter, Route } from 'react-router-dom';
import SpeakerDevice from '../devices/SpeakerDevice.cmpt';

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
  const RenderComponentFromDevice: FC<{device: IDevice}> = ({device}) => {
    switch (device.type) {
      case 'toggle':
        return <ToggleDevice device={device} activeIcon={faToggleOn} inactiveIcon={faToggleOff}/>;
      case 'window':
        return <WindowDevice device={device} windowOpenIcon={faDoorOpen} windowClosedIcon={faDoorClosed} lockIcon={faLock} unLockIcon={faUnlock} />;  // FontAwsome dosent have a window icon.
      case 'door':
        return <DoorDevice device={device} doorOpenIcon={faDoorOpen} doorClosedIcon={faDoorClosed} lockIcon={faLock} unLockIcon={faUnlock} />;
      case 'buzzer':
        return <SpeakerDevice device={device} playIcon={faPlay} noTuneSelectedIcon={faStopCircle} />;
      default:
        return null;
    }
  }

  return (
      <div>
        <div className='deviceContainerStyle'>
          {devices.map((device: IDevice, index: number) => <RenderComponentFromDevice device={device} key={index}  />)}
        </div>
      </div>
  )
}


// Export the component
export default DeviceContainerView