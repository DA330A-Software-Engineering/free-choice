import { faToggleOn, faToggleOff, faDoorOpen, faDoorClosed, faLock, faUnlock, faFan, faArrowLeft, faArrowRight, faPlay, faStopCircle, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import { IDevice } from "../../contexts/DeviceContext";
import OpenLockDevice from "../devices/OpenLock.cmpt";
import ToggleDevice from "../devices/ToggleDevice.cmpt";
import FanDevice from "../devices/FanDevice.cmpt";
import SpeakerDevice from '../devices/SpeakerDevice.cmpt';
import ScreenDevice from "../devices/ScreenDevice.cmpt";

  /** Render right component from type */
const RenderComponentFromDevice: FC<{device: IDevice, componentUpdated: (device: IDevice) => void}> = ({device, componentUpdated}) => {
switch (device.type) {
    case 'toggle':
      return <ToggleDevice device={device} activeIcon={faToggleOn} inactiveIcon={faToggleOff} onReceiveUpdate={(d) => componentUpdated(d)} />;
    case 'fan':
      return <FanDevice device={device} fanOnIcon={faFan} fanOffIcon={faToggleOff} ReverseFalseIcon={faArrowLeft} ReverseTrueIcon={faArrowRight} onReceiveUpdate={(d) => componentUpdated(d)} />;
    case 'buzzer':
      return <SpeakerDevice device={device } playIcon={faPlay} noTuneSelectedIcon={faStopCircle} onReceiveUpdate={(d) => componentUpdated(d)} />
    case 'screen':
      return <ScreenDevice device={device} screenIcon={faCommentDots} />
    case 'openLock':
    switch (device.tag) {
        case 'door':
        return <OpenLockDevice device={device} OpenIcon={faDoorOpen} ClosedIcon={faDoorClosed} lockIcon={faLock} unLockIcon={faUnlock} onReceiveUpdate={(d) => componentUpdated(d)} />;
        case 'window':
        return <OpenLockDevice device={device} OpenIcon={faDoorOpen} ClosedIcon={faDoorClosed} lockIcon={faLock} unLockIcon={faUnlock} onReceiveUpdate={(d) => componentUpdated(d)} />;  // FontAwsome dosent have a window icon.
        default:
        return null;
    } 
    default:
    return null;
}
}

export default RenderComponentFromDevice