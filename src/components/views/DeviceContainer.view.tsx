import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import RenderComponentFromDevice from '../utils/RenderComponentFromDevice.utils';
import ToggleDevice from '../devices/ToggleDevice.cmpt';
import OpenLockDevice from '../devices/OpenLock.cmpt';
import { faDoorClosed, faLock, faDoorOpen, faUnlock, faToggleOn, faToggleOff, faPlay, faStopCircle } from '@fortawesome/free-solid-svg-icons'
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
          name: docData.name,
          tag: docData.tag
        } 
        data.push(newDevice)
      })
      setDevices(data);
    })
  }, [])

  return (
      <div>
        <div className='deviceContainerStyle'>
          {devices.map((device: IDevice, index: number) => <RenderComponentFromDevice device={device} key={index} componentUpdated={() => null}  />)}
        </div>
      </div>
  )
}


// Export the component
export default DeviceContainerView