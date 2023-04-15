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
	const [selectedTune, setSelectedTune] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);


	const authContext = useAuth();
	const deviceContext = useDeviceContext();

	useEffect(() => {
		deviceContext.startListening(device.id, (newDevice: IDevice | null) => {
			if (newDevice == null) { throw new Error('Firebase error'); }

			if (newDevice.state.tune !== deviceState.state.tune) {
				setDeviceState(newDevice);
				setLoading(false);
			}
		});
	}, [deviceContext, device.id, deviceState.state.tune]);

	const onPlayTune = () => {
	if (deviceState.state.tune !== selectedTune) {
		const newDeviceState = { ...deviceState, state: { ...deviceState.state, tune: selectedTune } };
		console.log('Sending new device state:', newDeviceState);
		setDeviceState(newDeviceState);
		setLoading(true); // enable loading state
		updateDeviceState(newDeviceState);
	}
	};

	const updateDeviceState = (newDeviceState: IDevice) => {
		console.log('Updating device state:', newDeviceState);
		deviceContext.updateDevice(newDeviceState, authContext.getToken()!);
	};



	return (
		<div>
			<p>{deviceState.name}</p>
			<div className='deviceStyle'>
				<select value={selectedTune} onChange={(e) => {
					setSelectedTune(e.target.value);
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
					loading={loading}
					active={selectedTune === deviceState.state.tune}
				/>
			</div>
		</div>
	);
}

export default SpeakerDevice;
