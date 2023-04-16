import { faToggleOn, faToggleOff, faDoorOpen, faDoorClosed, faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import { IDevice } from "../../contexts/DeviceContext";
import OpenLockDevice from "../devices/OpenLock.cmpt";
import ToggleDevice from "../devices/ToggleDevice.cmpt";

  /** Render right component from type */
const RenderComponentFromDevice: FC<{device: IDevice}> = ({device}) => {
switch (device.type) {
    case 'toggle':
    return <ToggleDevice device={device} activceIcon={faToggleOn} unActivceicon={faToggleOff}/>;
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