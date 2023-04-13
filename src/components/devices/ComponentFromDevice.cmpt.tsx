import { faToggleOn, faToggleOff, faDoorOpen, faDoorClosed, faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import { IDevice } from "../../contexts/DeviceContext";
import DoorDevice from "./DoorDevice.cmpt";
import ToggleDevice from "./ToggleDevice.cmpt";
import WindowDevice from "./WindowDevice.cmpt";

  /** Render right component from type */
const ComponentFromDevice: FC<{device: IDevice}> = ({device}) => {
    switch (device.type) {
        case 'toggle':
        return <ToggleDevice device={device} activceIcon={faToggleOn} unActivceicon={faToggleOff}/>;
        case 'window':
        return <WindowDevice device={device} windowOpenIcon={faDoorOpen} windowClosedIcon={faDoorClosed} lockIcon={faLock} unLockIcon={faUnlock} />;  // FontAwsome dosent have a window icon.
        case 'door':
        return <DoorDevice device={device} doorOpenIcon={faDoorOpen} doorClosedIcon={faDoorClosed} lockIcon={faLock} unLockIcon={faUnlock}  />;
        default:
        return null;
    }
}

export default ComponentFromDevice
