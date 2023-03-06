import { FC, useState } from 'react';
import Button from '../Button.cmpt';

/** Props for this component */
type ToggleDeviceProps = {
    
}

/** Component for a toggable device */
const ToggleDevice: FC<ToggleDeviceProps> = () => {

    // Deivce state
    // TODO: Init for firebase
    const [DeviceOn, SetDeviceOn] = useState(false);

    return (
        <>
          <Button text={`Light: ${DeviceOn}`} onClick={function (): void {
                SetDeviceOn(!DeviceOn);
                console.log(DeviceOn);
            } } />
        </>
    )
}

// Export the component
export default ToggleDevice