import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'


/** Props for this component */
type ToggleDeviceProps = {
  device: IDevice,
  activceIcon: IconDefinition,
  unActivceicon: IconDefinition
}

/** Component for a toggable device */
const ToggleDevice: FC<ToggleDeviceProps> = ( {device, activceIcon, unActivceicon} ) => {

  // Device state
  const [Device, setDevice] = useState<IDevice>(device);
  const [loading, setLoading] = useState<boolean>(false); // Becouse its a delay when calling: APP -> API - FIREBASE -> APP. We need a loading state

  // Init contexts
  const authContext = useAuth()
  const deviceContext = useDeviceContext()


  // On Component Mount
  useEffect( () => {
    // Start listening on the device
    deviceContext.startListening(device.id, (newDevice: IDevice | null) => {
      if (newDevice == null) { throw new Error('Firebase error');}

      // When we have clicked on 'updateDevice' we are goin into a loading state.
      // When Firebase gets the update leave the loading state and update the button
      if (loading && (newDevice.state.on != Device.state.on)) {
        console.log('Update')
        setDevice(newDevice);
        setLoading(false);
      } else if (newDevice.state.on != Device.state.on) { setDevice(newDevice) }
    });
  }); 


  const onButtonClicked = () => {
    // Enable loading state
    // And send the new state to the API


    setLoading(true);

    // Update device
    deviceContext.updateDevice({
      id: Device.id,
      state: {"on": !Device.state.on},
      type: Device.type
    }, authContext.getToken()!);
  };

  
  return (
    <div>
      <p>{Device.name}</p>
      <div className='deviceStyle'>
        <Button 
          disabled={false}
          onClick={onButtonClicked}
          className='deviceButton'
          icon={!!Device.state.on ? activceIcon : unActivceicon} loading={loading} active={!!Device.state.on}/>
      </div>
    </div>
  )
}

// Export the component
export default ToggleDevice