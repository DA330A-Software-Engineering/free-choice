import { FC, useEffect, useState } from "react";

/** Props for this component */
type InputProps = {
  className?: string;
  placeholder: string;
  onChange: (value: string) => void;
  maxLength?: number;
  onFocus?: () => void; // Add the onFocus prop
  value?: string;
  inputStyle?: string;
  type?: string;
};

/** Custom input */
const Input: FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  maxLength,
  onFocus,
  type,
}) => {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        value={value} // Pass the value prop to the input element
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        maxLength={maxLength}
        onFocus={onFocus}
      />
    </>
  );
};

// Export the component
export default Input;
