// config.js
// Check for Vite environment variables (client-side)
const viteBackendUrl = import.meta.env.VITE_BACKEND_URL;

// Check for Vue environment variables (legacy/server-side)
const vueBackendUrl = import.meta.env.VUE_BACKEND_URL;

// Determine which one to use, with fallbacks for local development or production
const backendUrl = viteBackendUrl || vueBackendUrl || 
                  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                   ? "http://127.0.0.1:8080" 
                   : "http://194.31.53.238:8080");

// Remove any trailing slashes
export const BACKEND_URL = backendUrl.replace(/\/$/, "");

// Log for debugging
console.log("Using backend URL:", BACKEND_URL);