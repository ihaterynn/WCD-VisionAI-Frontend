// config.js
const isProduction = import.meta.env.PROD;
const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

// For Vercel deployments, use the API proxy
// For local development, use the local or specified backend URL
export const BACKEND_URL = (isProduction && isVercel)
  ? '/api' 
  : (import.meta.env.VUE_BACKEND_URL || "http://127.0.0.1:8080").replace(/\/$/, "");

// Log which backend URL is being used (for debugging)
console.log('Using backend URL:', BACKEND_URL);