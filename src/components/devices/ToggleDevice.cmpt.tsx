import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';
import WbIncandescentOutlinedIcon from '@mui/icons-material/WbIncandescentOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { toggleDeviceStyle, iconStyle, nameStyle } from './ToggleDevice.style';


/** Props for this component */
type ToggleDeviceProps = {
  device: IDevice,
  IconActive?: React.ElementType,
  IconDisabled?: React.ElementType
}

const getIconComponent = (type: IDevice['type'], active: boolean) => {
  switch (type) {
    case 'toggle':
      return active ? WbIncandescentIcon : WbIncandescentOutlinedIcon;
    default:
      return null;
  }
};

/** Component for a toggle-able device */
const ToggleDevice: FC<ToggleDeviceProps> = ({ device }) => {

  const [loading, setLoading] = useState<boolean>(true);
  const [active, setActive] = useState<boolean>(false);
  const auth = useAuth();
  const deviceContext = useDeviceContext();

  useEffect(() => {
    deviceContext.startListening(device.id, (device: IDevice | null) => {
      if (device == null) {
        throw new Error('Firebase error');
      }

      let newState = device.state.on;
      if (newState === undefined) {
        newState = false; // default to off
      }

      setActive(newState);
      setLoading(false);
    });
  }, [deviceContext, device]);

  const onButtonClick = () => {
    const newActive = !active;

    deviceContext.updateDevice(
      {
        id: device.id,
        state: { on: newActive },
        type: device.type,
        name: device.name,
      },
      auth.getToken()!
    );

    setActive(newActive);
  };

  const IconComponent = getIconComponent(device.type, active);

return (
  <div className={toggleDeviceStyle}>
    <Button onClick={onButtonClick}>
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        IconComponent && <IconComponent className={iconStyle} />
      )}
    </Button>
    <span className={nameStyle}>{device.name}</span>
  </div>
);

};

// Export the component
export default ToggleDevice;
