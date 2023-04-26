import React, { FC } from 'react';
import { IDevice } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import { faToggleOn, faToggleOff, faFan, faPlay, faStopCircle, faCommentDots, faDoorOpen, faDoorClosed, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';

type RenderComponentForRoutineProps = {
  device: IDevice;
  onStateChange: (newState: any) => void;
};

const RenderComponentForRoutine: FC<RenderComponentForRoutineProps> = ({ device, onStateChange }) => {
  const handleButtonClick = (state: any) => {
    onStateChange(state);
  };

  switch (device.type) {
    case 'toggle':
      return (
        <Button
          onClick={() => handleButtonClick({ type: 'toggle', state: !device.state })}
          icon={device.state ? faToggleOn : faToggleOff}
        />
      );
    case 'fan':
      return (
        <Button
          onClick={() => handleButtonClick({ type: 'fan', state: !device.state })}
          icon={device.state ? faFan : faToggleOff}
        />
      );
    case 'buzzer':
      return (
        <Button
          onClick={() => handleButtonClick({ type: 'buzzer', state: !device.state })}
          icon={device.state ? faPlay : faStopCircle}
        />
      );
    case 'screen':
      return (
        <Button
          onClick={() => handleButtonClick({ type: 'screen', state: !device.state })}
          icon={device.state ? faCommentDots : faStopCircle}
        />
      );
    case 'openLock':
      switch (device.tag) {
        case 'door':
          return (
            <Button
              onClick={() => handleButtonClick({ type: 'openLock', tag: 'door', state: !device.state })}
              icon={device.state ? faDoorOpen : faDoorClosed}
            />
          );
        case 'window':
          return (
            <Button
              onClick={() => handleButtonClick({ type: 'openLock', tag: 'window', state: !device.state })}
              icon={device.state ? faDoorOpen : faDoorClosed}
            />
          );
        default:
          return null;
      }
    default:
      return null;
  }
};

export default RenderComponentForRoutine;
