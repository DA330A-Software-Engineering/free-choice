import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, IState, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'


/** Props for this component */
type ToggleDeviceProps = {
  device: IDevice,
  activeIcon: IconDefinition,
  inactiveIcon: IconDefinition,
  onReceiveUpdate?: (device: IDevice) => void
  ghostComponent?: boolean,
  ghostUpdateDeviceCallback?: (state: IState) => void
}

/** Component for a toggable device */
const ToggleDevice: FC<ToggleDeviceProps> = ( {device, activeIcon, inactiveIcon, ghostComponent, ghostUpdateDeviceCallback, onReceiveUpdate} ) => {

  // Device state
  const [Device, setDevice] = useState<IDevice>(device);
  const [loading, setLoading] = useState<boolean>(false); // Becouse its a delay when calling: APP -> API - FIREBASE -> APP. We need a loading state

  // Init contexts
  const authContext = useAuth()
  const deviceContext = useDeviceContext()


  // On Component Mount
  useEffect( () => {
    if(ghostComponent) return;
    // Start listening on the device
    deviceContext.startListening(device.id, (newDevice: IDevice | null) => {
      if (newDevice == null) { throw new Error('Firebase error');}
      // When we have clicked on 'updateDevice' we are goin into a loading state.
      // When Firebase gets the update leave the loading state and update the button
      if (loading && (newDevice.state.on != Device.state.on)) {
        setDevice(newDevice);
        setLoading(false);
      } else if (newDevice.state.on != Device.state.on) { 
        if (typeof onReceiveUpdate !== 'undefined') onReceiveUpdate(newDevice);
        setDevice(newDevice) 
      }
    });
  }); 


  const onButtonClicked = () => {
    // Enable loading state
    // And send the new state to the API
    
    if(ghostComponent) {
      if (typeof ghostUpdateDeviceCallback === 'undefined') return;
      ghostUpdateDeviceCallback( {"on": !Device.state.on})
      return;
    }

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
          icon={!!Device.state.on ? activeIcon : inactiveIcon} loading={loading} active={!!Device.state.on}/>
      </div>
    </div>
  )
}

// Export the component
export default ToggleDevice