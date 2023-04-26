import { faDoorOpen, faDoorClosed, faLock, faUnlock, faToggleOn, faToggleOff, faL, faFan, faArrowLeft, faArrowRight, faPlay, faStopCircle, faCommentDots } from "@fortawesome/free-solid-svg-icons"
import { FC, useState } from "react"
import OpenLockDevice from "../devices/OpenLock.cmpt"
import { IGroup } from "../views/GroupContainer.view"
import { IDevice, IState, useDeviceContext } from "../../contexts/DeviceContext"
import ToggleDevice from "../devices/ToggleDevice.cmpt"
import { useAuth } from "../../contexts/AuthContext"
import FanDevice from "../devices/FanDevice.cmpt"
import SpeakerDevice from "../devices/SpeakerDevice.cmpt"
import ScreenDevice from "../devices/ScreenDevice.cmpt"


const RenderCorrectGhostDeviceFromGroup: FC<{group: IGroup}> = ({group}) => {

    const deviceContext = useDeviceContext();
    const auth = useAuth();

    const ghostDevice: IDevice = {
        id: "",
        state: {},
        type: (group.devices[0] as IDevice).type,
        name: "The Group",
        tag: ""
    }

    const updateDevices = (state: IState, devices: IDevice[]) => {
        devices.forEach((d: IDevice) => {
            deviceContext.updateDevice({
                id: d.id,
                state: state,
                type: d.type
            }, auth.getToken() as string)
        });
    }


    switch(ghostDevice.type) {

        case 'openLock':
            // Rule:
            const openLockState = {open: false, locked: false} as IState
            // if any are locked: lock all and close all
            (group.devices as IDevice[]).forEach((device: IDevice) => {
                if (device.state.locked) {
                    openLockState.locked = true;
                    openLockState.open = false;
                    return;
                }
            });

            // if none is locked an one is open, open all
            if (!openLockState.locked) {
                (group.devices as IDevice[]).forEach((device: IDevice) => {
                    if (device.state.open) {
                        openLockState.open = true;
                        return;
                    }
                });
            }

            ghostDevice.state = openLockState;

            return (
                <OpenLockDevice 
                    device={ghostDevice}
                    OpenIcon={faDoorOpen}
                    ClosedIcon={faDoorClosed}
                    lockIcon={faLock}
                    unLockIcon={faUnlock}
                    ghostComponent={true}
                    ghostUpdateDeviceCallback={(newState: IState) => {updateDevices(newState, group.devices as IDevice[])}} />
            )
        
        case 'toggle':

            // Rule

            // if on lamp is on, turn on all
            const toggleState = {on: false} as IState
            (group.devices as IDevice[]).forEach((device: IDevice) => {
                if (device.state.on!) {
                    toggleState.on = true;
                    return;
                }
            });

            ghostDevice.state = toggleState;

            return (
                <ToggleDevice
                    device={ghostDevice}
                    activeIcon={faToggleOn}
                    inactiveIcon={faToggleOff}
                    ghostComponent={true}
                    ghostUpdateDeviceCallback={(newState: IState) => {updateDevices(newState, group.devices as IDevice[])}} />
            )
        
        case 'fan':

            // Rule:

            const fanState = {on: false, reverse: false} as IState

            // if any are on set on, if any is revers set reveres
            (group.devices as IDevice[]).forEach((device: IDevice) => {
                if (device.state.on) {
                    fanState.on = true;
                }
                if (device.state.reverse) {
                    fanState.reverse = true;
                }
            });

            ghostDevice.state = fanState;

            return (
                <FanDevice 
                    device={ghostDevice}
                    fanOnIcon={faFan}
                    fanOffIcon={faToggleOff}
                    ReverseFalseIcon={faArrowLeft}
                    ReverseTrueIcon={faArrowRight}
                    ghostComponent={true}
                    ghostUpdateDeviceCallback={(newState: IState) => {updateDevices(newState, group.devices as IDevice[])}} />
            )

        case 'buzzer': 

            return (
                <SpeakerDevice 
                    device={ghostDevice}
                    ghostComponent={true}
                    ghostUpdateDeviceCallback={(newState: IState) => { updateDevices(newState, group.devices as IDevice[]) } } 
                    playIcon={faPlay} noTuneSelectedIcon={faStopCircle} />
            )
        
        case 'screen':

            return (
                <ScreenDevice 
                    device={ghostDevice}
                    ghostComponent={true}
                    ghostUpdateDeviceCallback={(newState: IState) => { updateDevices(newState, group.devices as IDevice[]) } } 
                    screenIcon={faCommentDots} />
            )

        default:
            return null;
    }

}
    
export default RenderCorrectGhostDeviceFromGroup

