import { faToggleOn, faToggleOff, faDoorOpen, faDoorClosed, faLock, faUnlock, faFan, faArrowLeft, faArrowRight, faPlay, faStopCircle, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import { IDevice } from "../../contexts/DeviceContext";
import OpenLockDevice from "../devices/OpenLock.cmpt";
import ToggleDevice from "../devices/ToggleDevice.cmpt";
import FanDevice from "../devices/FanDevice.cmpt";
import SpeakerDevice from '../devices/SpeakerDevice.cmpt';
import ScreenDevice from "../devices/ScreenDevice.cmpt";

  /** Render right component from type */
const RenderComponentFromDevice: FC<{device: IDevice}> = ({device}) => {
switch (device.type) {
    case 'toggle':
      return <ToggleDevice device={device} activeIcon={faToggleOn} inactiveIcon={faToggleOff} />;
    case 'fan':
      return <FanDevice device={device} fanOnIcon={faFan} fanOffIcon={faToggleOff} ReverseFalseIcon={faArrowLeft} ReverseTrueIcon={faArrowRight} />;
    case 'buzzer':
      return <SpeakerDevice device={device } playIcon={faPlay} noTuneSelectedIcon={faStopCircle} />
    case 'screen':
      return <ScreenDevice device={device} screenIcon={faCommentDots} />
    case 'openLock':
    switch (device.tag) {
        case 'door':
        return <OpenLockDevice device={device} OpenIcon={faDoorOpen} ClosedIcon={faDoorClosed} lockIcon={faLock} unLockIcon={faUnlock}  />;
        case 'window':
        return <OpenLockDevice device={device} OpenIcon={faDoorOpen} ClosedIcon={faDoorClosed} lockIcon={faLock} unLockIcon={faUnlock} />;  // FontAwsome dosent have a window icon.
        default:
        return null;
    } 
    default:
    return null;
}
}

export default RenderComponentFromDevice