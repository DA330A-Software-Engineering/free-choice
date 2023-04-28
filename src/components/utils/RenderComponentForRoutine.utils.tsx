import React, { FC, useEffect, useState } from "react";
import { IDevice } from "../../contexts/DeviceContext";
import Button from "../interactable/Button.cmpt";
import {
  faToggleOn,
  faToggleOff,
  faFan,
  faDoorOpen,
  faDoorClosed,
  faLock,
  faUnlock,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Input from "../interactable/Input.cmpt";
import OnScreenKeyboard from "./OnScreenKeyBoard.util";

type RenderComponentForRoutineProps = {
  device: IDevice;
  onStateChange: (newState: any) => void;
  handleScreenInputChange?: (input: string) => void;
};

const RenderComponentForRoutine: FC<RenderComponentForRoutineProps> = ({
  device,
  onStateChange,
  handleScreenInputChange,
}) => {
  const [componentState, setComponentState] = useState({
    localDeviceState: device.state || {},
    showKeyboard: false,
  });

  useEffect(() => {
    console.log("State change:", componentState.localDeviceState);
    onStateChange(componentState.localDeviceState);
  }, [componentState.localDeviceState]);

  useEffect(() => {
    console.log("Device change:", device);
    setComponentState({
      localDeviceState: device.state || {},
      showKeyboard: false,
    });
  }, [device]);

  const handleButtonClick = (state: any) => {
    console.log("Button click:", state);
    setComponentState((prevState) => ({
      ...prevState,
      localDeviceState: { ...prevState.localDeviceState, ...state },
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Select change:", e.target.value);
    setComponentState((prevState) => ({
      ...prevState,
      localDeviceState: { ...prevState.localDeviceState, tune: e.target.value },
    }));
  };

  const { localDeviceState } = componentState;

  switch (device.type) {
    case "toggle":
      return (
        <Button
          onClick={() => handleButtonClick({ on: !localDeviceState.on })}
          icon={localDeviceState.on ? faToggleOn : faToggleOff}
        />
      );
    case "fan":
      return (
        <div>
          <Button
            onClick={() =>
              handleButtonClick({
                ...localDeviceState,
                on: !localDeviceState.on,
              })
            }
            icon={localDeviceState.on ? faFan : faToggleOff}
          />
          <Button
            onClick={() =>
              handleButtonClick({
                ...localDeviceState,
                state: !localDeviceState.reverse,
              })
            }
            icon={localDeviceState.on ? faArrowRight : faArrowLeft}
          />
        </div>
      );
    case "buzzer":
      return (
        <div>
          <select value={localDeviceState.tune} onChange={handleSelectChange}>
            <option value="">Select a tune...</option>
            <option key="alarm" value="alarm">
              Alarm
            </option>
            <option key="pirate" value="pirate">
              Pirates of the Caribbean
            </option>
            <option key="pokemon" value="pokemon">
              Pokemon Theme
            </option>
          </select>
        </div>
      );

    case "screen":
      return (
        <>
          <Input
            className="routine-input"
            placeholder="Enter text to display"
            value={localDeviceState.text}
            onChange={(value) => onStateChange({ state: { text: value } })}
            maxLength={16}
            onFocus={() => {
              setComponentState((prevState) => ({
                ...prevState,
                showKeyboard: true,
              }));
            }}
          />
          {componentState.showKeyboard && (
            <OnScreenKeyboard
              onInput={(input) =>
                handleScreenInputChange && handleScreenInputChange(input)
              }
              onBlur={() =>
                setComponentState((prevState) => ({
                  ...prevState,
                  showKeyboard: false,
                }))
              }
            />
          )}
        </>
      );
    case "openLock":
      switch (device.tag) {
        case "door":
          return (
            <div>
              <Button
                onClick={() =>
                  handleButtonClick({
                    state: !localDeviceState.open,
                  })
                }
                icon={localDeviceState.open ? faDoorOpen : faDoorClosed}
              />
              <Button
                onClick={() =>
                  handleButtonClick({
                    state: !localDeviceState.locked,
                  })
                }
                icon={localDeviceState.locked ? faLock : faUnlock}
              />
            </div>
          );
        case "window":
          return (
            <div>
              <Button
                onClick={() =>
                  handleButtonClick({
                    state: !localDeviceState.open,
                  })
                }
                icon={device.state.open ? faDoorOpen : faDoorClosed}
              />
              <Button
                onClick={() =>
                  handleButtonClick({
                    state: !localDeviceState.locked,
                  })
                }
                icon={device.state.locked ? faLock : faUnlock}
              />
            </div>
          );
        default:
          return null;
      }
    default:
      return null;
  }
};

export default RenderComponentForRoutine;
