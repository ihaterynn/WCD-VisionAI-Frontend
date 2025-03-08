// config.js
// Determine if running locally based on the hostname
const isLocalhost = typeof window !== "undefined" && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Export the appropriate backend URL
export const BACKEND_URL = isLocalhost 
  ? "http://127.0.0.1:8050"  // Local development
  : "https://wcdvision.ddns.net";  // Production

// Log which URL is being used (for debugging)
console.log(`Using backend URL: ${BACKEND_URL}`);