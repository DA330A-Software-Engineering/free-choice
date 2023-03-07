import { FC } from 'react';

/** Props for this component */
type ButtonProps = {
    text: string;
    onClick: () => void;
}

/** Custom button */
const Button: FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <>
          <button onClick={onClick}>{text}</button>
        </>
    )
}

// Export the component
export default Button