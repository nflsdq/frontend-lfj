import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: string;
  className?: string;
}

declare const Input: React.FC<InputProps>;
export default Input; 