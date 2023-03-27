import { FC, ReactNode } from 'react';
import { buttonStyle } from './Button.style';

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  text?: string;
  className?: string;
};

const Button: FC<ButtonProps> = ({ children, onClick, text, className }) => {
  return (
    <button onClick={onClick} className={`${buttonStyle} ${className}`}>
      {text && <span>{text}</span>}
      {children}
    </button>
  );
};

export default Button;
