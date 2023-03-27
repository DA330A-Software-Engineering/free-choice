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
  const [activeState, SetActiveState] = useState<boolean>(); // Becuse window and toggle has two diffrent names for the same functionallity

  // Init contexts
  const authContext = useAuth()
  const deviceContext = useDeviceContext()


  // On Component Mount
  useEffect( () => {
    // Start listening on the device
    deviceContext.startListening(device.id, (device: IDevice | null) => {
      if (device == null) { throw new Error('Firebase error');}

      // Need to do this, cuz window and toggle has two diffrent names
      // for the same functionallity
      let newState = device.state.on
      if (newState == undefined){ newState = device.state.open }


      // When we have clicked on 'updateDevice' we are goin into a loading state.
      // When Firebase gets the update leave the loading state and update the button
      if (Loading && (newState != activeState)) {
        SetActiveState(newState);
        SetLoading(false);
      } else if (newState != activeState) { SetActiveState(newState) }
    });
  }); 


  const onButtonClicked = () => {
    // Enable loading state
    // And send the new state to the API

    // Need to do this, cuz window and toggle has two diffrent names
    // for the same functionallity
    let deviceState = {};
    if (device.type == 'window') {
      deviceState = { open: !activeState }
    } else if (device.type == 'toggle') {
      deviceState = { on: !activeState }
    }

    SetLoading(true);

    // Update device
    deviceContext.updateDevice({
      id: Device.id,
      state: deviceState,
      type: Device.type,
      name: Device.name
    }, authContext.getToken()!);
  };

  
  return (
      <>
        <Button 
          text={`${Device.name}: ${activeState}, Loading: ${Loading}`}
          onClick={ onButtonClicked } />
      </>
  )
}

// Export the component
export default ToggleDevice