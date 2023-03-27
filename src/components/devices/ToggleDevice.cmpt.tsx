import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';
import WbIncandescentOutlinedIcon from '@mui/icons-material/WbIncandescentOutlined';
import WindowIcon from '@mui/icons-material/Window';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import WarningIcon from '@mui/icons-material/Warning';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { IStateToggle } from '../../contexts/DeviceContext';


const styles = {
  button: {
    padding: '16px',
    fontSize: '2rem',
    borderRadius: '4px',
    backgroundColor: '#1976d2',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '5rem',
    margin: '16px',
  },
  lockIcon: {
    fontSize: '2rem',
    margin: '16px',
  },
};



/** Props for this component */
type ToggleDeviceProps = {
    device: IDevice
}

/** Component for a toggleable device */
const ToggleDevice: FC<ToggleDeviceProps> = ( {device} ) => {

  // Device state
  const [Device, SetDevice] = useState<IDevice>(device);
  const [Loading, SetLoading] = useState<Boolean>(false); // Because its a delay when calling: APP -> API - FIREBASE -> APP. We need a loading state

  // Init contexts
  const authContext = useAuth()
  const deviceContext = useDeviceContext()


  // On Component Mount
  useEffect( () => {
    // Start listening on the device
    deviceContext.startListening(device.id, (device: IDevice | null) => {
      if (device == null) { throw new Error('Firebase error');}

      // When we have clicked on 'updateDevice' we are going into a loading state.
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

    let updatedState: IStateToggle;

    switch (Device.type) {
        case 'door':
            updatedState = {
                open: !Device.state.open,
                locked: Device.state.locked
            };
            break;
        case 'window':
            updatedState = {
                open: !Device.state.open
            };
            break;
        case 'display':
            updatedState = {
                text: Device.state.text,
                on: !Device.state.on
            };
            break;
        case 'lightState':
        case 'fan':
        case 'speaker':
            updatedState = {
                on: !Device.state.on
            };
            break;
        default:
            updatedState = {};
            break;
    }

    deviceContext.updateDevice({
        id: Device.id,
        state: updatedState,
        type: Device.type
    }); //,authContext.getToken()!);
};



  let IconComponent;
  let LockIconComponent;
  if (Device.type === 'door') {
    IconComponent = Device.state.open ? MeetingRoomIcon : MeetingRoomOutlinedIcon;
    LockIconComponent = Device.state.locked ? LockIcon : LockOpenIcon;

  } else {
    LockIconComponent = null;
    switch (Device.type) {
      case 'window':
        IconComponent = Device.state.open ? WindowIcon : WindowOutlinedIcon;
        break;
      case 'whiteLed':
        IconComponent = Device.state.on ? WbIncandescentIcon : WbIncandescentOutlinedIcon;
        break;
      case 'yellowLed':
        IconComponent = Device.state.on ? WarningIcon : WarningOutlinedIcon;
        break;
      case 'speaker':
        IconComponent = Device.state.on ? VolumeUpIcon : VolumeOffIcon;
        break;
      case 'fan':
        IconComponent = Device.state.on ? AcUnitIcon : AcUnitOutlinedIcon;
        break;
      default:
        IconComponent = null;
        break;
    }
  }

  return (
    <>
      <Button style={styles.button} onClick={onButtonClicked}>
        {IconComponent && <IconComponent style={styles.icon} />}
        {LockIconComponent && <LockIconComponent style={styles.lockIcon} />}
        {`Light: ${Device.state.on}, Loading: ${Loading}`}
      </Button>
    </>
  );
};

export default ToggleDevice;