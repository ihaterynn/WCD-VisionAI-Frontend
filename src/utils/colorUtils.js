/**
 * Color utility functions for calculating color similarity
 * and filtering recommendations based on color distance
 */

/**
 * Converts RGB to LAB color space for better perceptual comparison
 * @param {Object} rgb - RGB color object {r, g, b} with values 0-255
 * @returns {Object} LAB color object {l, a, b}
 */
export function rgbToLab(rgb) {
    // Normalize RGB values to 0-1 range
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;
    
    // Apply gamma correction
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    
    // Convert to XYZ color space
    let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    
    // Normalize with reference white point
    x /= 0.95047;
    y /= 1.0;
    z /= 1.08883;
    
    // Apply cube root transformation
    x = x > 0.008856 ? Math.pow(x, 1/3) : (903.3 * x + 16) / 116;
    y = y > 0.008856 ? Math.pow(y, 1/3) : (903.3 * y + 16) / 116;
    z = z > 0.008856 ? Math.pow(z, 1/3) : (903.3 * z + 16) / 116;
    
    // Calculate LAB components
    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const bValue = 200 * (y - z); // Changed variable name from 'b' to 'bValue'
    
    return { l, a, b: bValue }; // Return with property name 'b'
  }
  
  /**
   * Calculates Delta-E (CIE76) color difference between two colors
   * @param {Object} color1 - First color in RGB format {r, g, b}
   * @param {Object} color2 - Second color in RGB format {r, g, b}
   * @returns {number} Color difference value (smaller = more similar)
   */
  export function calculateColorDistance(color1, color2) {
    // Convert RGB to LAB
    const lab1 = rgbToLab(color1);
    const lab2 = rgbToLab(color2);
    
    // Calculate Euclidean distance
    return Math.sqrt(
      Math.pow(lab1.l - lab2.l, 2) + 
      Math.pow(lab1.a - lab2.a, 2) + 
      Math.pow(lab1.b - lab2.b, 2)
    );
  }
  
  /**
   * Checks if two colors are similar based on a threshold
   * @param {Object} color1 - First color in RGB format {r, g, b}
   * @param {Object} color2 - Second color in RGB format {r, g, b}
   * @param {number} threshold - Threshold percentage (higher = more tolerance)
   * @returns {boolean} True if colors are similar, false otherwise
   */
  export function areColorsSimilar(color1, color2, threshold = 15) {
    // Convert threshold percentage to actual LAB distance value
    // Max LAB distance is around 100, so we scale the threshold
    const maxDistance = 100;
    const distanceThreshold = (threshold / 100) * maxDistance;
    
    const distance = calculateColorDistance(color1, color2);
    return distance <= distanceThreshold;
  }
  
  /**
   * Converts hex color string to RGB object
   * @param {string} hex - Hex color string (e.g. "#FF5733")
   * @returns {Object} RGB object {r, g, b}
   */
  export function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  }
  
  /**
   * Converts RGB object to hex string
   * @param {Object} rgb - RGB object {r, g, b}
   * @returns {string} Hex color string
   */
  export function rgbToHex(rgb) {
    const toHex = (value) => {
      const hex = Math.round(value).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }
  
  /**
   * Parse various color formats from recommendations
   * @param {string|Object} colorValue - Color value from recommendation
   * @returns {Object|null} RGB object {r, g, b} or null if invalid
   */
  export function parseColorFromRecommendation(colorValue) {
    if (!colorValue) return null;
    
    // Check if it's a hex string (e.g. "#FF5733")
    if (typeof colorValue === 'string' && colorValue.startsWith('#')) {
      return hexToRgb(colorValue);
    }
    
    // Check if it's a CSS RGB string (e.g. "rgb(255, 87, 51)")
    if (typeof colorValue === 'string' && colorValue.startsWith('rgb')) {
      const matches = colorValue.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (matches) {
        return { 
          r: parseInt(matches[1]), 
          g: parseInt(matches[2]), 
          b: parseInt(matches[3]) 
        };
      }
    }
    
    // Check if it's a comma-separated string (e.g. "255,87,51")
    if (typeof colorValue === 'string' && colorValue.includes(',')) {
      const parts = colorValue.split(',');
      if (parts.length >= 3) {
        const r = parseInt(parts[0].trim());
        const g = parseInt(parts[1].trim());
        const b = parseInt(parts[2].trim());
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
          return { r, g, b };
        }
      }
    }
    
    // Check if it's already an RGB object
    if (typeof colorValue === 'object' && 
        'r' in colorValue && 
        'g' in colorValue && 
        'b' in colorValue) {
      return colorValue;
    }
    
    // If we can't parse it, return null
    return null;
  }
  
  /**
   * Filters recommendations by color similarity
   * @param {Array} recommendations - Array of recommendation objects
   * @param {Object} targetColor - Target color in RGB format {r, g, b}
   * @param {number} threshold - Similarity threshold percentage
   * @param {string} colorField - Field name that contains color in recommendations
   * @returns {Array} Filtered recommendations
   */
  export function filterRecommendationsByColor(recommendations, targetColor, threshold = 15, colorField = 'color_code') {
    if (!targetColor || !recommendations || recommendations.length === 0) {
      return recommendations;
    }
    
    return recommendations.filter(rec => {
      // Get the color value from the recommendation
      const recColorValue = rec[colorField];
      const recColor = parseColorFromRecommendation(recColorValue);
      
      // If we couldn't parse the color, skip this recommendation
      if (!recColor) return false;
      
      // Check if colors are similar
      return areColorsSimilar(targetColor, recColor, threshold);
    });
  }