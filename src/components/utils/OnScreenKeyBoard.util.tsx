// OnScreenKeyboard.util.tsx

import React, { FC, useState, useCallback } from "react";
import SimpleKeyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

interface OnScreenKeyboardProps {
  onInput: (input: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const OnScreenKeyboard: FC<OnScreenKeyboardProps> = ({
  onInput,
  onBlur,
  onFocus,
}) => {
  const [layoutName, setLayoutName] = useState("default");

  const handleShift = () => {
    setLayoutName(layoutName === "default" ? "shift" : "default");
  };

  const handleKeyPress = useCallback(
    (button: string) => {
      if (button === "{shift}" || button === "{lock}") {
        handleShift();
      }
    },
    [layoutName]
  );

  return (
    <SimpleKeyboard
      layoutName={layoutName}
      onChange={onInput}
      onKeyPress={handleKeyPress}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
};

export default OnScreenKeyboard;
