import * as React from "react";

export interface JobFilterProps {
  onFilter: (params: any) => void;
  className?: string;
}

declare const JobFilter: React.FC<JobFilterProps>;
export default JobFilter; 