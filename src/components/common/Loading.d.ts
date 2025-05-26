import * as React from "react";

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: string;
  color?: string;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

declare const Loading: React.FC<LoadingProps>;
export default Loading; 