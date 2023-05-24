import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, IState, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

type SpeakerDeviceProps = {
	device: IDevice,
	playIcon: IconDefinition,
	noTuneSelectedIcon: IconDefinition,
	onReceiveUpdate?: (device: IDevice) => void
	ghostComponent?: boolean,
	ghostUpdateDeviceCallback?: (state: IState) => void
}

const SpeakerDevice: FC<SpeakerDeviceProps> = ({ device, playIcon, noTuneSelectedIcon, onReceiveUpdate, ghostComponent, ghostUpdateDeviceCallback }) => {
	const [deviceState, setDeviceState] = useState<IDevice>(device);
	const [selectedTune, setSelectedTune] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);


	const authContext = useAuth();
	const deviceContext = useDeviceContext();

	useEffect(() => {
		if (ghostComponent) return;
		deviceContext.startListening(device.id, (newDevice: IDevice | null) => {
			if (newDevice == null) { throw new Error('Firebase error'); }

			if (newDevice.state.tune !== deviceState.state.tune) {
				setDeviceState(newDevice);
				setLoading(false);
				if (typeof onReceiveUpdate !== 'undefined') onReceiveUpdate(newDevice);
			}
		});
	}, [deviceContext, device.id, deviceState.state.tune]);

	const onPlayTune = () => {
	if (deviceState.state.tune !== selectedTune) {

		const newDeviceState = {
		id: deviceState.id,
		type: deviceState.type,
		state: { tune: selectedTune },
		};

		setDeviceState({ ...deviceState, state: { ...deviceState.state, tune: selectedTune } });
		setLoading(true); 
		updateDeviceState(newDeviceState)
	}
	};

	const updateDeviceState = (newDeviceState: IDevice) => {

		if (ghostComponent) {
			if (typeof ghostUpdateDeviceCallback === 'undefined') return;
			console.log(newDeviceState.state)
			ghostUpdateDeviceCallback(newDeviceState.state)
			return;
		};

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
