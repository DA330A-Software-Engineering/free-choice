import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import ComponentFromDevice from '../devices/ComponentFromDevice.cmpt';

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
        const docData = doc.data() as IDevice;
        docData.id = doc.id
        data.push(docData)
      })
      setDevices(data);
    })
  }, [])


  return (
      <div>
        <div className='deviceContainerStyle'>
          {devices.map((device: IDevice, index: number) => <ComponentFromDevice device={device} key={index}  />)}
        </div>
      </div>
  )
}


// Export the component
export default DeviceContainerView