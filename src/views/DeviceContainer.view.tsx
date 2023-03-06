import { FC } from 'react';
import ToggleDevice from '../components/devices/ToggleDevice.cmpt';

/** Props for this component */
type DeviceContainerProps = {
    
}

/** View containing all the devices */
const DeviceContainer: FC<DeviceContainerProps> = () => {
    return (
        <>
          <ToggleDevice />
        </>
    )
}

// Export the component
export default DeviceContainer