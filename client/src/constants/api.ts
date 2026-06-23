export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  PROFILES: '/profiles',
  GROUPS: '/groups',
  CATEGORIES: '/categories',
  QUESTIONS: '/questions',
  RECOMMENDATIONS: '/recommendations',
} as const;
