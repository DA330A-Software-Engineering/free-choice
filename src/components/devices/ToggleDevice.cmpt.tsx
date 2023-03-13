import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';

/** Props for this component */
type ToggleDeviceProps = {
    device: IDevice
}

/** Component for a toggable device */
const ToggleDevice: FC<ToggleDeviceProps> = ( {device} ) => {

  // Device state
  const [Device, SetDevice] = useState<IDevice>(device);
  const [Loading, SetLoading] = useState<Boolean>(false); // Becouse its a delay when calling: APP -> API - FIREBASE -> APP. We need a loading state

  // Init contexts
  const authContext = useAuth()
  const deviceContext = useDeviceContext()


  // On Component Mount
  useEffect( () => {
    // Start listening on the device
    deviceContext.startListening(device.id, (device: IDevice | null) => {
      if (device == null) { throw new Error('Firebase error');}

      // When we have clicked on 'updateDevice' we are goin into a loading state.
      // When Firebase gets the update leave the loading state and update the button
      if (Loading && (device.state.on != Device.state.on)) {
        SetDevice(device);
        SetLoading(false);
      } else if (device.state.on != Device.state.on) { SetDevice(device) }
    });
  });


  const onButtonClicked = () => {
    // Enable loading state
    // And send the new state to the API
    SetLoading(true);
    deviceContext.updateDevice({
      id: Device.id,
      state: { on: !Device.state.on},
      type: Device.type
    },authContext.getToken()!);
  };

  
  return (
      <>
        <Button 
          text={`Light: ${Device.state.on}, Loading: ${Loading}`}
          onClick={ onButtonClicked } />
      </>
  )
}

// Export the component
export default ToggleDevice