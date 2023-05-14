import { FC, useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice, IState, useDeviceContext } from '../../contexts/DeviceContext';
import Button from '../interactable/Button.cmpt';
import Input from '../interactable/Input.cmpt';
import { faMinus, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import SimpleKeyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';


type ScreenDeviceProps = {
  device: IDevice;
  screenIcon: IconDefinition;
  onReceiveUpdate?: (device: IDevice) => void
  ghostComponent?: boolean,
  ghostUpdateDeviceCallback?: (state: IState) => void
};

const ScreenDevice: FC<ScreenDeviceProps> = ({ device, screenIcon, ghostComponent, ghostUpdateDeviceCallback, onReceiveUpdate }) => {
  const [inputString, setInputString] = useState('');
  const [deviceState, setDeviceState] = useState<IDevice>(device);
  const [loading, setLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [layoutName, setLayoutName] = useState("default");

  const authContext = useAuth();
  const deviceContext = useDeviceContext();

  useEffect(() => {
    if(ghostComponent) return;
    deviceContext.startListening(device.id, (newDevice: IDevice | null) => {
      if (newDevice == null) { throw new Error('Firebase error'); }
      if (newDevice.state.text !== deviceState.state.text) {
        if (typeof onReceiveUpdate !== 'undefined') onReceiveUpdate(newDevice);
        setDeviceState(newDevice);
        setLoading(false);
      }
    });
  }, [deviceContext, device.id]);

  const handleSubmit = () => {
    if (deviceState.state.text !== inputString) {

      if(ghostComponent) {
        if (typeof ghostUpdateDeviceCallback === 'undefined') return;
        ghostUpdateDeviceCallback( {"text": inputString})
        return;
      }
  

      const newDeviceState = {
        id: deviceState.id,
        type: deviceState.type,
        state: { text: inputString },
      };
      console.log("newDeviceState:", newDeviceState);
      setDeviceState({ ...deviceState, state: { ...deviceState.state, text: inputString } });
      setLoading(true);
      deviceContext.updateDevice(newDeviceState, authContext.getToken()!);
    }
  };

  const onInputFocus = () => {
    setShowKeyboard(true);
  };

  const onKeyboardInput = (input: string) => {
    setInputString(input);
  };

  const handleShift = () => {
    setLayoutName(layoutName === "default" ? "shift" : "default");
  };

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  return (
    <div>
      <p>{deviceState.name}</p>
      <div className="deviceStyle">
        <Input
          placeholder="Enter display text"
          maxLength={16}
          value={inputString}
          onChange={(value) => setInputString(value)}
          onFocus={onInputFocus} inputStyle={''}        />
        <Button
          onClick={handleSubmit}
          className="submitButton"
          loading={loading}
          disabled={!inputString}
          icon={screenIcon}
          active={deviceState.state.text === inputString}
        />
        {showKeyboard && (
          <Button
            onClick={() => setShowKeyboard(false)}
            className="keyboardButton"
            icon={faMinus}
          />
        )}
      </div>
      {showKeyboard && (
        <div className="keyboardWrapper">
          <SimpleKeyboard
            className="keyboard"
            layoutName={layoutName}
            onChange={(input) => onKeyboardInput(input)}
            onKeyPress={onKeyPress}
            inputName={"inputString"}
            inputDisplay={{
              "inputString": inputString
            }}
          />
        </div>
      )}
    <p>Current text: {deviceState.state.text}</p>
    </div>
  );
};

export default ScreenDevice;