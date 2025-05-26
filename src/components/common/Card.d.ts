import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  hoverEffect?: boolean;
  shadowSize?: "sm" | "md" | "lg" | "xl";
}

declare const Card: React.FC<CardProps>;
export default Card; 