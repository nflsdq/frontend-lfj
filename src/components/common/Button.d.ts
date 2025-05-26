import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline";
  className?: string;
  fullWidth?: boolean;
}

declare const Button: React.FC<ButtonProps>;
export default Button; 