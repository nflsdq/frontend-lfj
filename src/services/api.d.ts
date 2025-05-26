import { AxiosResponse } from 'axios';

export declare const authAPI: {
  register(data: any): Promise<AxiosResponse<any>>;
  login(data: any): Promise<AxiosResponse<any>>;
  logout(): Promise<AxiosResponse<any>>;
  getProfile(): Promise<AxiosResponse<any>>;
  updateProfile(data: any): Promise<AxiosResponse<any>>;
};

export declare const cvAPI: {
  getCV(): Promise<AxiosResponse<any>>;
  createUpdateCV(data: any): Promise<AxiosResponse<any>>;
  generateCV(): Promise<AxiosResponse<any>>;
  exportCV(): Promise<AxiosResponse<any>>;
  matchJobs(): Promise<AxiosResponse<any>>;
  analyzeUploadedCV(file: File): Promise<AxiosResponse<any>>;
  aiChat(data: any): Promise<AxiosResponse<any>>;
};

export declare const experienceAPI: {
  getExperiences(): Promise<AxiosResponse<any>>;
  createExperience(data: any): Promise<AxiosResponse<any>>;
  getExperience(id: any): Promise<AxiosResponse<any>>;
  updateExperience(id: any, data: any): Promise<AxiosResponse<any>>;
  deleteExperience(id: any): Promise<AxiosResponse<any>>;
};

export declare const educationAPI: {
  getEducations(): Promise<AxiosResponse<any>>;
  createEducation(data: any): Promise<AxiosResponse<any>>;
  getEducation(id: any): Promise<AxiosResponse<any>>;
  updateEducation(id: any, data: any): Promise<AxiosResponse<any>>;
  deleteEducation(id: any): Promise<AxiosResponse<any>>;
};

export declare const skillsAPI: {
  getSkills(): Promise<AxiosResponse<any>>;
  createSkill(data: any): Promise<AxiosResponse<any>>;
  getSkill(id: any): Promise<AxiosResponse<any>>;
  updateSkill(id: any, data: any): Promise<AxiosResponse<any>>;
  deleteSkill(id: any): Promise<AxiosResponse<any>>;
};

export declare const jobsAPI: {
  getJobs(params?: any): Promise<AxiosResponse<any>>;
  getJob(id: any): Promise<AxiosResponse<any>>;
}; 