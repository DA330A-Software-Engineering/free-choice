import { FC, useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import TvIcon from '@mui/icons-material/Tv';
import TvOffIcon from '@mui/icons-material/TvOff';


/** Props for this component */
type InputDeviceProps = {
	device: IDevice;
};

/** Component for an input device */
const InputDevice: FC<InputDeviceProps> = ({ device }) => {
	// Device state
	const [Device, SetDevice] = useState<IDevice>(device);
	const [Loading, SetLoading] = useState<Boolean>(false); // Because its a delay when calling: APP -> API - FIREBASE -> APP. We need a loading state


	// Init contexts
	const authContext = useAuth();
	const deviceContext = useDeviceContext();

	// On Component Mount

	useEffect(() => {
		deviceContext.startListening(device.id, (device: IDevice | null) => {
			if (device == null) { throw new Error('Firebase error'); }
			SetDevice(device);
		});
	});
	
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const updatedText = e.target.value;
		deviceContext.updateDevice({
			id: Device.id,
			state: { text: updatedText, on: Device.state.on },
			type: Device.type
		});
	};

	const handleToggleDisplay = () => {
        deviceContext.updateDevice({
            id: Device.id,
            state: { text: Device.state.text, on: !Device.state.on },
            type: Device.type
        });
    };

	const onButtonClicked = () => {
		// Enable loading state
		// And send the new state to the API
		SetLoading(true);
		deviceContext.updateDevice({
			id: Device.id,
			state: { on: !Device.state.on },
			type: Device.type
		})//,authContext.getToken()!);
	};

	let IconComponent;
	switch (Device.type) {
		case 'display':
			IconComponent = ChatBubbleOutlineIcon;
			break;
		default:
			IconComponent = null;
	}


    const DisplayIcon = Device.state.on ? TvIcon : TvOffIcon;

	return (
		<>
			{Device.type === 'display' && (
				<div>
					<TextField
						label="Display Text"
						value={Device.state.text}
						onChange={handleInputChange}
						disabled={!Device.state.on}
					/>
					<IconButton onClick={handleToggleDisplay}>
						<DisplayIcon />
					</IconButton>
				</div>
			)}
		</>
	);
};

// Export the component
export default InputDevice;
