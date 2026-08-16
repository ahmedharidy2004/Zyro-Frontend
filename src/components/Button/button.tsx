import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

export default Button;