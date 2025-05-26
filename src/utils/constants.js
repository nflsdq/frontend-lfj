// Education Levels
export const EDUCATION_LEVELS = [
  'SD',
  'SMP',
  'SMA/SMK',
  'D1',
  'D2',
  'D3',
  'D4',
  'S1',
  'S2',
  'S3'
];

// Skill Levels
export const SKILL_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

// Job Categories
export const JOB_CATEGORIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Sales',
  'Design',
  'Engineering',
  'Customer Service',
  'Administration',
  'Logistics',
  'Human Resources',
  'Legal',
  'Media',
  'Other'
];

// Job Types
export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
  'Remote'
];

// Experience Levels
export const EXPERIENCE_LEVELS = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Executive'
];

// Salary Ranges
export const SALARY_RANGES = [
  { label: 'Under Rp 3,000,000', min: 0, max: 3000000 },
  { label: 'Rp 3,000,000 - Rp 5,000,000', min: 3000000, max: 5000000 },
  { label: 'Rp 5,000,000 - Rp 10,000,000', min: 5000000, max: 10000000 },
  { label: 'Rp 10,000,000 - Rp 20,000,000', min: 10000000, max: 20000000 },
  { label: 'Above Rp 20,000,000', min: 20000000, max: null }
];

// Common Locations in Indonesia
export const COMMON_LOCATIONS = [
  'Jakarta',
  'Surabaya',
  'Bandung',
  'Medan',
  'Semarang',
  'Makassar',
  'Yogyakarta',
  'Denpasar',
  'Palembang',
  'Balikpapan'
];

// Month names
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

// User roles
export const USER_ROLES = {
  JOB_SEEKER: 'pencari kerja',
  RECRUITER: 'recruiter',
  ADMIN: 'admin'
};

// CV templates
export const CV_TEMPLATES = [
  { id: 'modern', name: 'Modern' },
  { id: 'classic', name: 'Classic' },
  { id: 'creative', name: 'Creative' },
  { id: 'professional', name: 'Professional' },
  { id: 'minimal', name: 'Minimal' }
];

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/register',
    LOGIN: '/login',
    LOGOUT: '/logout',
    PROFILE: '/profile'
  },
  CV: {
    GET: '/cv',
    CREATE_UPDATE: '/cv',
    GENERATE: '/cv/generate',
    EXPORT: '/cv/export',
    MATCH_JOBS: '/cv/match-jobs',
    ANALYZE_UPLOAD: '/cv/analyze-upload',
    AI_CHAT: '/cv/ai-chat'
  },
  EXPERIENCE: {
    LIST: '/pengalaman',
    CREATE: '/pengalaman',
    GET: '/pengalaman/:id',
    UPDATE: '/pengalaman/:id',
    DELETE: '/pengalaman/:id'
  },
  EDUCATION: {
    LIST: '/pendidikan',
    CREATE: '/pendidikan',
    GET: '/pendidikan/:id',
    UPDATE: '/pendidikan/:id',
    DELETE: '/pendidikan/:id'
  },
  SKILLS: {
    LIST: '/skills',
    CREATE: '/skills',
    GET: '/skills/:id',
    UPDATE: '/skills/:id',
    DELETE: '/skills/:id'
  },
  JOBS: {
    LIST: '/jobs',
    GET: '/jobs/:id'
  }
};