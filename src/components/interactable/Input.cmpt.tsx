import { FC, useEffect, useState } from "react";

/** Props for this component */
type InputProps = {
  className?: string;
  placeholder: string;
  onChange: (value: string) => void;
  maxLength?: number;
  onFocus?: () => void; // Add the onFocus prop
  value?: string;
};

/** Custom input */
const Input: FC<InputProps> = ({
  className,
  placeholder,
  value,
  onChange,
  maxLength,
  onFocus,
}) => {
  return (
    <>
      <input
        className={className}
        placeholder={placeholder}
        value={value}
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
