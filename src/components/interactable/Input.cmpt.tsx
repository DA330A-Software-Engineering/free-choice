import { FC, useEffect, useState } from 'react';

/** Props for this component */
type InputProps = {
    placeholder: string;
    onChange: (value: string) => void;
    maxLength?: number;
    onFocus?: () => void; // Add the onFocus prop
    value?: string;
}

/** Custom input */
const Input: FC<InputProps> = ({ placeholder, value, onChange, maxLength, onFocus }) => {
    return (
        <>
        <input
            placeholder={placeholder}
            value={value} // Pass the value prop to the input element
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            maxLength={maxLength}
            onFocus={onFocus}
        />
        </>
    );
};


// Export the component
export default Input