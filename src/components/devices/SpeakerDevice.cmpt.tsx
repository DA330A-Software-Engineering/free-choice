import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

type SpeakerDeviceProps = {
	device: IDevice,
	playIcon: IconDefinition,
	noTuneSelectedIcon: IconDefinition
}

const SpeakerDevice: FC<SpeakerDeviceProps> = ({ device, playIcon, noTuneSelectedIcon }) => {
	const [deviceState, setDeviceState] = useState<IDevice>(device);

	const authContext = useAuth();
	const deviceContext = useDeviceContext();

	useEffect(() => {
		deviceContext.startListening(device.id, (newDevice: IDevice | null) => {
			if (newDevice == null) { throw new Error('Firebase error'); }

			if (newDevice.state.tune !== deviceState.state.tune) {
				setDeviceState(newDevice);
			}
		});
	}, [deviceContext, device.id, deviceState.state.tune]);

	const onPlayTune = () => {
		if (deviceState.state.tune !== selectedTune) {
			const newDeviceState = { ...deviceState, state: { ...deviceState.state, tune: selectedTune } };
			setDeviceState(newDeviceState);
			updateDeviceState(newDeviceState);
		}
	};

	const updateDeviceState = (newDeviceState: IDevice) => {
		deviceContext.updateDevice(newDeviceState, authContext.getToken()!);
	};

	const selectedTune = deviceState.state.tune ?? "";
	const isLoading = device.id !== deviceState.id;

	return (
		<div>
			<p>{deviceState.name}</p>
			<div className='deviceStyle'>
				<select value={selectedTune} onChange={(e) => {
					const newDeviceState = { ...deviceState, state: { ...deviceState.state, tune: e.target.value } };
					setDeviceState(newDeviceState);
				}}>
					<option value="">Select a tune...</option>
					<option value="alarm">Alarm</option>
					<option value="pirate">Pirates of the Caribbean</option>
					<option value="pokemon">Pokemon Theme</option>
				</select>
				<Button
					disabled={!selectedTune}
					onClick={onPlayTune}
					className='deviceButton'
					icon={selectedTune ? playIcon : noTuneSelectedIcon}
					loading={isLoading}
					active={selectedTune === deviceState.state.tune}
				/>
			</div>
		</div>
	);
}

export default SpeakerDevice;
