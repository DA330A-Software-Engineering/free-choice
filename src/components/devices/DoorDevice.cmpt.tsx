import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

type DoorDeviceProps = {
  device: IDevice,
  doorOpenIcon: IconDefinition,
  doorClosedIcon: IconDefinition,
  lockIcon: IconDefinition,
  unLockIcon: IconDefinition
}

const DoorDevice: FC<DoorDeviceProps> = ({ device, doorOpenIcon, doorClosedIcon, lockIcon, unLockIcon }) => {
	const [Device, setDevice] = useState<IDevice>(device);
	const [loading, setLoading] = useState<boolean>(false);

	const authContext = useAuth()
	const deviceContext = useDeviceContext()

	// On Component Mount
	useEffect( () => {
		// Start listening on the device
		deviceContext.startListening(device.id, (newDevice: IDevice | null) => {
		if (newDevice == null) { throw new Error('Firebase error');}

		// When we have clicked on 'updateDevice' we are going into a loading state.
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
			<div className='deviceStyle'>
				<Button
					onClick={() => updateDeviceState({open: !Device.state.open, locked: Device.state.locked})}
					className='deviceButton'
					loading={loading}
					disabled={!!(!Device.state.open && Device.state.locked)}
					active={!!Device.state.open}
					icon={Device.state.open ? doorOpenIcon : doorClosedIcon}/>
				<Button
					onClick={() => updateDeviceState({open: Device.state.open, locked: !Device.state.locked})}
					className='deviceButton'
					disabled={!!(Device.state.open && !Device.state.locked)}
					icon={Device.state.locked ? lockIcon : unLockIcon}
					loading={loading}
					active={!!Device.state.locked} />
			</div>
		</div>
	);
}

export default DoorDevice;
