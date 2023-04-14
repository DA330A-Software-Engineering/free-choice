import { initializeApp } from 'firebase/app';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import ToggleDevice from '../devices/ToggleDevice.cmpt';
import OpenLockDevice from '../devices/OpenLock.cmpt';
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
          name: docData.name,
          tag: docData.tag
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
        return <ToggleDevice device={device} activceIcon={faToggleOn} unActivceicon={faToggleOff}/>;
      case 'openLock':
        switch (device.tag) {
          case 'door':
            return <OpenLockDevice device={device} OpenIcon={faDoorOpen} ClosedIcon={faDoorClosed} lockIcon={faLock} unLockIcon={faUnlock}  />;
          case 'window':
            return <OpenLockDevice device={device} OpenIcon={faDoorOpen} ClosedIcon={faDoorClosed} lockIcon={faLock} unLockIcon={faUnlock} />;  // FontAwsome dosent have a window icon.
          default:
            return null;
        } 
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