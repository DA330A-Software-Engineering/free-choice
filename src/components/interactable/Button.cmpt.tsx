import { FC, ReactNode, CSSProperties } from 'react';

/** Props for this component */
type ButtonProps = {
    children: ReactNode;
    onClick: () => void;
    className?: string;
    style?: CSSProperties;
};

/** Custom button */
const Button: FC<ButtonProps> = ({ children, onClick, className, style }) => {
    return (
        <>
            <button className={className} style={style} onClick={onClick}>
                {children}
            </button>
        </>
    );
};

// Export the component
export default Button;
