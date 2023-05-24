// OnScreenKeyboard.util.tsx

import React, { FC, useState, useCallback, useEffect } from "react";
import SimpleKeyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

interface OnScreenKeyboardProps {
  onInput: (input: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  inputValue: string;
}

const OnScreenKeyboard: FC<OnScreenKeyboardProps> = ({
  onInput,
  onBlur,
  onFocus,
  inputValue,
}) => {
  const [layoutName, setLayoutName] = useState("default");
  const [currentInput, setCurrentInput] = useState(inputValue);

  useEffect(() => {
    setCurrentInput(inputValue);
  }, [inputValue]);

  const handleShift = () => {
    setLayoutName(layoutName === "default" ? "shift" : "default");
  };

  const handleKeyPress = useCallback(
    (button: string) => {
      let newValue = currentInput; // new line
      if (button === "{shift}" || button === "{lock}") {
        handleShift();
      } else if (button === "{bksp}") {
        newValue = currentInput.slice(0, -1);
      } else if (button === "{space}") {
        newValue = currentInput + " ";
      } else if (button.length === 1) {
        newValue = currentInput + button;
      }
      setCurrentInput(newValue);
      onInput(newValue);
    },
    [layoutName, currentInput, onInput]
  );

  return (
    <SimpleKeyboard
      layoutName={layoutName}
      onKeyPress={handleKeyPress}
      onBlur={onBlur}
      onFocus={onFocus}
      inputDisplay={{
        inputString: inputValue,
      }}
    />
  );
};

export default OnScreenKeyboard;
