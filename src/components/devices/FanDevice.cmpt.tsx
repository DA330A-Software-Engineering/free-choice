import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, IState, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

type FanDeviceProps = {
	device: IDevice,
	fanOnIcon: IconDefinition,
	fanOffIcon: IconDefinition,
	ReverseFalseIcon: IconDefinition,
	ReverseTrueIcon: IconDefinition,
	onReceiveUpdate?: (device: IDevice) => void
	ghostComponent?: boolean,
	ghostUpdateDeviceCallback?: (state: IState) => void
}

const FanDevice: FC<FanDeviceProps> = ({ device, fanOnIcon, fanOffIcon, ReverseFalseIcon, ReverseTrueIcon, onReceiveUpdate, ghostComponent, ghostUpdateDeviceCallback }) => {
	const [Device, setDevice] = useState<IDevice>(device);
	const [loading, setLoading] = useState<boolean>(false);

	const authContext = useAuth()
	const deviceContext = useDeviceContext()

	useEffect(() => {
		if (ghostComponent) return;
		deviceContext.startListening(device.id, (newDevice: IDevice | null) => {
			if (newDevice == null) { throw new Error('Firebase error');}
			if (loading && ((newDevice.state.on !== Device.state.on) || (newDevice.state.reverse !== Device.state.reverse))) {
			setDevice(newDevice);
			setLoading(false);
			} else if ((newDevice.state.on !== Device.state.on) || (newDevice.state.reverse !== Device.state.reverse)) { 
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
				onClick={() => updateDeviceState({on: !Device.state.on, reverse: Device.state.reverse})}
				className='deviceButton'
				loading={loading}
				active={!!Device.state.on}
				disabled={false}
				icon={Device.state.on ? fanOnIcon : fanOffIcon}/>
			<Button
				onClick={() => updateDeviceState({on: Device.state.on, reverse: !Device.state.reverse})}
				className='deviceButton'
				loading={loading}
				active={!!Device.state.reverse}
				disabled={false}
				icon={Device.state.reverse ? ReverseTrueIcon : ReverseFalseIcon} />
		</div>
    </div>
	);
}

export default FanDevice;