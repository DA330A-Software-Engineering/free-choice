// OnScreenKeyboard.util.tsx

import React, { FC, useState, useCallback } from "react";
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

  const handleShift = () => {
    setLayoutName(layoutName === "default" ? "shift" : "default");
  };

  const handleKeyPress = useCallback(
    (button: string) => {
      if (button === "{shift}" || button === "{lock}") {
        handleShift();
      } else if (button === "{bksp}") {
        setCurrentInput(currentInput.slice(0, -1));
        onInput(currentInput.slice(0, -1));
      } else if (button === "{space}") {
        setCurrentInput(currentInput + " ");
        onInput(currentInput + " ");
      } else if (button === "{enter}") {
        // handle enter key press if needed
      } else if (button.length === 1) {
        setCurrentInput(currentInput + button);
        onInput(currentInput + button);
      }
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
