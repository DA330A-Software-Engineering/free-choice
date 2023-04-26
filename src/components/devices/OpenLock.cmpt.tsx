import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, IState, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

type DoorDeviceProps = {
  device: IDevice,
  OpenIcon: IconDefinition,
  ClosedIcon: IconDefinition,
  lockIcon: IconDefinition,
  unLockIcon: IconDefinition,
  onReceiveUpdate?: (device: IDevice) => void
  ghostComponent?: boolean,
  ghostUpdateDeviceCallback?: (state: IState) => void
}

const OpenLockDevice: FC<DoorDeviceProps> = ({ device, OpenIcon: doorOpenIcon, ClosedIcon: doorClosedIcon, lockIcon, unLockIcon, ghostComponent, ghostUpdateDeviceCallback, onReceiveUpdate}) => {
	const [Device, setDevice] = useState<IDevice>(device);
	const [loading, setLoading] = useState<boolean>(false);

	const authContext = useAuth()
	const deviceContext = useDeviceContext()

	// On Component Mount
	useEffect( () => {
		if (ghostComponent) return;
		// Start listening on the device
		deviceContext.startListening(device.id, (newDevice: IDevice | null) => {
			if (newDevice == null) { throw new Error('Firebase error');}
			// When we have clicked on 'updateDevice' we are goin into a loading state.
			// When Firebase gets the update leave the loading state and update the button
			if (loading && ((newDevice.state.locked != Device.state.locked) || (newDevice.state.open != Device.state.open))) {
				setDevice(newDevice);
				setLoading(false);
			} else if ((newDevice.state.locked != Device.state.locked) || (newDevice.state.open != Device.state.open)) { 
				if (typeof onReceiveUpdate !== 'undefined') onReceiveUpdate(newDevice);
				setDevice(newDevice) 
			}
		});
	}); 


	const updateDeviceState = (state: {}) => {
		
		
		if (ghostComponent) {
			if (typeof ghostUpdateDeviceCallback === 'undefined') return;
			ghostUpdateDeviceCallback(state)
			return;
		};

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

export default OpenLockDevice;
