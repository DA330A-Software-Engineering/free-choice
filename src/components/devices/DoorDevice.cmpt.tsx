import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import { deviceStyle } from './Device.style';

type DoorDeviceProps = {
  device: IDevice,
}

const DoorDevice: FC<DoorDeviceProps> = ({ device }) => {
	const [Device, SetDevice] = useState<IDevice>(device);
	const [Loading, SetLoading] = useState<Boolean>(false);
	const [doorState, setDoorState] = useState({
		/* The nullish coalescing operator (??) is used to provide the default values of false when 
		the respective device.state properties are null or undefined. 
		This ensures that doorState always has valid boolean values 
		for both the open and locked properties. */
		open: device.state.open ?? false,
		locked: device.state.locked ?? false
	});

	const authContext = useAuth()
	const deviceContext = useDeviceContext()

	useEffect(() => {
		deviceContext.startListening(device.id, (device: IDevice | null) => {
			if (device == null) { throw new Error('Firebase error'); }

			setDoorState({
				open: device.state.open ?? false,
				locked: device.state.locked ?? false
			});

			// Set loading state to false when receiving new state from device context
			SetLoading(false);
		});
	});

	const onToggleLock = () => {
		if (!doorState.open) {
			updateDeviceState({ open: doorState.open, locked: !doorState.locked });
		} else {
			alert('You cannot lock the door when it is open.');
		}
	};

	const onToggleDoor = () => {
		if (!doorState.locked) {
			updateDeviceState({ open: !doorState.open, locked: doorState.locked });
		} else {
			alert('You cannot open the door when it is locked.');
		}
	};

	const updateDeviceState = (newState: { open: boolean, locked: boolean }) => {
		SetLoading(true);

		deviceContext.updateDevice({
			id: Device.id,
			state: newState,
			type: Device.type,
			name: Device.name
		}, authContext.getToken()!);
	};

	return (
		<>
			<Button
				text={`Door: ${doorState.open ? 'Open' : 'Closed'}, Loading: ${Loading}`}
				onClick={onToggleDoor}
				className={deviceStyle}
			/>
			<Button
				text={`Lock: ${doorState.locked ? 'Locked' : 'Unlocked'}, Loading: ${Loading}`}
				onClick={onToggleLock}
				className={deviceStyle}
			/>
		</>
	);
}

export default DoorDevice;
