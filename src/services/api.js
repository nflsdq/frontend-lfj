import axios from 'axios';
import toast from 'react-hot-toast';

// Create an axios instance
const api = axios.create({
  // baseURL: 'http://localhost:8000/api',
  baseURL: 'https://api-lfj.naufalsidiq.xyz/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to include the token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response && response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (response && response.data && response.data.message) {
      // Show error message from API
      toast.error(response.data.message);
    } else {
      // Show generic error message
      toast.error('An error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (data, config = {}) => api.post('/register', data, config),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
};

export const cvAPI = {
  getCV: () => api.get('/cv'),
  createUpdateCV: (data) => api.post('/cv', data),
  generateCV: () => api.post('/cv/generate'),
  exportCV: () => api.get('/cv/export', { responseType: 'blob' }),
  matchJobs: () => api.post('/cv/match-jobs'),
  analyzeUploadedCV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/cv/analyze-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  aiChat: (data) => api.post('/cv/ai-chat', data),
};

export const experienceAPI = {
  getExperiences: () => api.get('/pengalaman'),
  createExperience: (data) => api.post('/pengalaman', data),
  getExperience: (id) => api.get(`/pengalaman/${id}`),
  updateExperience: (id, data) => api.put(`/pengalaman/${id}`, data),
  deleteExperience: (id) => api.delete(`/pengalaman/${id}`),
};

export const educationAPI = {
  getEducations: () => api.get('/pendidikan'),
  createEducation: (data) => api.post('/pendidikan', data),
  getEducation: (id) => api.get(`/pendidikan/${id}`),
  updateEducation: (id, data) => api.put(`/pendidikan/${id}`, data),
  deleteEducation: (id) => api.delete(`/pendidikan/${id}`),
};

export const skillsAPI = {
  getSkills: () => api.get('/skills'),
  createSkill: (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return api.post('/skills', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getSkill: (id) => api.get(`/skills/${id}`),
  updateSkill: (id, data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return api.put(`/skills/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteSkill: (id) => api.delete(`/skills/${id}`),
};

export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
};

export default api;