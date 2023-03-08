import { FC } from 'react';
import ToggleDevice from '../devices/ToggleDevice.cmpt';

/** Props for this component */
type DeviceContainerProps = {
    
}

/** View containing all the devices */
const DeviceContainerView: FC<DeviceContainerProps> = () => {
    return (
        <>
          <ToggleDevice />
        </>
    )
}

// Export the component
export default DeviceContainerView