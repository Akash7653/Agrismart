// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://agrismart-7zyv.onrender.com/api';

// Frontend Configuration
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'https://agrismart-mu.vercel.app';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/users/login`,
  REGISTER: `${API_BASE_URL}/users/register`,
  
  // Consultations
  EXPERTS: `${API_BASE_URL}/consultations/experts`,
  CONSULTATION_TYPES: `${API_BASE_URL}/consultations/consultation-types`,
  CHAT_SEND: `${API_BASE_URL}/consultations/chat/send`,
  BOOK_CONSULTATION: `${API_BASE_URL}/consultations/book`,
  
  // Marketplace
  PRODUCTS: `${API_BASE_URL}/marketplace/products`,
  PAYMENTS_CREATE_ORDER: `${API_BASE_URL}/payments/create-order`,
  PAYMENTS_VERIFY: `${API_BASE_URL}/payments/verify`,
  
  // User History
  USER_HISTORY: (userId: string) => `${API_BASE_URL}/user/history/${userId}`,
  USER_STATS: (userId: string) => `${API_BASE_URL}/user-history/stats/${userId}`,
  
  // Health
  HEALTH: `${API_BASE_URL}/health`,
  DEBUG: `${API_BASE_URL}/debug`
};

export default API_BASE_URL;
