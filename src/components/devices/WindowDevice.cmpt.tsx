import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import { deviceButton, deviceStyle } from './Device.style';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

type WindowDeviceProps = {
  device: IDevice,
  windowOpenIcon: IconDefinition,
  windowClosedIcon: IconDefinition,
  lockIcon: IconDefinition,
  unLockIcon: IconDefinition
}

const WindowDevice: FC<WindowDeviceProps> = ({ device, windowClosedIcon, windowOpenIcon, lockIcon, unLockIcon }) => {
	const [Device, setDevice] = useState<IDevice>(device);
	const [loading, setLoading] = useState<boolean>(false);


	const authContext = useAuth()
	const deviceContext = useDeviceContext()

	// On Component Mount
	useEffect( () => {
		// Start listening on the device
		deviceContext.startListening(device.id, (newDevice: IDevice | null) => {
		if (newDevice == null) { throw new Error('Firebase error');}

		// When we have clicked on 'updateDevice' we are goin into a loading state.
		// When Firebase gets the update leave the loading state and update the button
		if (loading && ((newDevice.state.locked != Device.state.locked) || (newDevice.state.open != Device.state.open))) {
			setDevice(newDevice);
			setLoading(false);
		} else if ((newDevice.state.locked != Device.state.locked) || (newDevice.state.open != Device.state.open)) { setDevice(newDevice) }
		});
	}); 


	const updateDeviceState = (state: {}) => {
		setLoading(true);
		deviceContext.updateDevice({
			id: Device.id,
			state: state,
			type: Device.type
		}, authContext.getToken()!);
	};

	return (

		<div>
			<p>{Device.name}</p>
			<div className={deviceStyle}>
			<Button
				onClick={() => updateDeviceState({open: !Device.state.open, locked: Device.state.locked})}
				className={deviceButton}
				disabled={!!(!Device.state.open && Device.state.locked)}
				icon={Device.state.open ? windowOpenIcon : windowClosedIcon} loading={loading} active={!!Device.state.open}/>
			<Button
				onClick={() => updateDeviceState({open: Device.state.open, locked: !Device.state.locked})}
				disabled={!!(Device.state.open && !Device.state.locked)}
				className={deviceButton}
				icon={Device.state.locked ? lockIcon : unLockIcon} loading={loading} active={!!Device.state.locked}/>
			</div>
		</div>
	);
}

export default WindowDevice;
