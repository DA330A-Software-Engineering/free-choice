import { FC, useEffect, useState } from 'react';

/** Props for this component */
type InputProps = {
    placeholder: string;
    onChange: (value: string) => void;
}

/** Custom input */
const Input: FC<InputProps> = ({ placeholder, onChange }) => {

    const [value, SetValue] = useState("");

    useEffect(() => {
        onChange(value);
    }, [value]);

    return (
        <>
          <input placeholder={placeholder} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => SetValue(e.target.value)}/>
        </>
    )
}

// Export the component
export default Input