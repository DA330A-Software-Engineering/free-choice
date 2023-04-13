import { FC, useEffect, useState, useCallback } from 'react';
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
	const [Device, SetDevice] = useState<IDevice>(device);
	const [Loading, SetLoading] = useState<boolean>(false);
	const [speakerState, setSpeakerState] = useState({
		tune: device.state.tune ?? ""
	});
  const [selectedTune, setSelectedTune] = useState<string>("");

	const authContext = useAuth()
	const deviceContext = useDeviceContext()

	useEffect(() => {
		deviceContext.startListening(device.id, (device: IDevice | null) => {
			if (device == null) { throw new Error('Firebase error'); }

			setSpeakerState({
				tune: device.state.tune ?? ""
			});

			SetLoading(false);
		});
	}, [deviceContext, device.id, speakerState.tune]);

	const onPlayTune = () => {
		// Make sure a tune is selected
		if (selectedTune) {
			SetLoading(true);
			updateDeviceState({ tune: selectedTune });
		} else {
			alert('Please select a tune to play.');
		}
	};

	const updateDeviceState = useCallback(
	(newState: { tune: string }) => {
		console.log('Updating device state:', newState);
		SetLoading(true);
		deviceContext.updateDevice({
		id: Device.id,
		state: { tune: newState.tune },
		type: Device.type,
		name: Device.name
		}, authContext.getToken()!);
	},
	[Device.id, Device.type, Device.name, deviceContext, authContext]
	);

	return (
		<div>
			<p>{Device.name}</p>
			<div className='deviceStyle'>
				<select value={selectedTune} onChange={(e) => {
					setSelectedTune(e.target.value);
					console.log(`Selected tune: ${e.target.value}`);
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
					loading={Loading}
					active={!!selectedTune}
				/>
			</div>
		</div>
	);
}

export default SpeakerDevice;
