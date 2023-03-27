import { FC } from 'react';
import{ buttonStyle } from './Button.style';

/** Props for this component */
type ButtonProps = {
    text: string;
    onClick: () => void;
    className?: string;
}

/** Custom button */
const Button: FC<ButtonProps> = ({ text, onClick, className }) => {
    return (
        <>
          <button onClick={onClick} className={`${buttonStyle} ${className}`}>{text}</button>
        </>
    )
}

// Export the component
export default Button