import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import { deviceStyle } from './Device.style';

type WindowDeviceProps = {
  device: IDevice,
}

const WindowDevice: FC<WindowDeviceProps> = ({ device }) => {
	const [Device, SetDevice] = useState<IDevice>(device);
	const [Loading, SetLoading] = useState<Boolean>(false);
	const [windowState, setWindowState] = useState({
		open: device.state.open ?? false,
		locked: device.state.locked ?? false
	});

	const authContext = useAuth()
	const deviceContext = useDeviceContext()

	useEffect(() => {
		deviceContext.startListening(device.id, (device: IDevice | null) => {
			if (device == null) { throw new Error('Firebase error'); }

			setWindowState({
				open: device.state.open ?? false,
				locked: device.state.locked ?? false
			});

			// Set loading state to false when receiving new state from device context
			SetLoading(false);
		});
	});

	const onToggleLock = () => {
		if (!windowState.open) {
			updateDeviceState({ open: windowState.open, locked: !windowState.locked });
		} else {
			alert('You cannot lock the window when it is open.');
		}
	};

	const onToggleWindow = () => {
		if (!windowState.locked) {
			updateDeviceState({ open: !windowState.open, locked: windowState.locked });
		} else {
			alert('You cannot open the window when it is locked.');
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
				text={`Window: ${windowState.open ? 'Open' : 'Closed'}, Loading: ${Loading}`}
				onClick={onToggleWindow}
				className={deviceStyle}
			/>
			<Button
				text={`Lock: ${windowState.locked ? 'Locked' : 'Unlocked'}, Loading: ${Loading}`}
				onClick={onToggleLock}
				className={deviceStyle}
			/>
		</>
	);
}

export default WindowDevice;
