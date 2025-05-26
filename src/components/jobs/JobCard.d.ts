import * as React from "react";

export interface Job {
  id: number;
  position: string;
  company: string;
  companyLogo?: string;
  location?: string;
  salary?: number;
  date?: string;
}

export interface JobCardProps {
  job: Job;
}

declare const JobCard: React.FC<JobCardProps>;
export default JobCard; 