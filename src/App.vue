<template>
  <div class="min-h-screen flex flex-col relative dark:bg-gray-900 transition-colors duration-300" id="content-to-export">
    <!-- Theme toggle -->
    <ThemeToggle />
    
    <!-- Loading screen -->
    <LoadingScreen 
      :show="isLoading" 
      :message="loadingMessage"
    />
    
    <!-- Notification toast -->
    <NotificationToast 
      :show="notification.show"
      :type="notification.type"
      :message="notification.message"
      :title="notification.title"
      :duration="3000"
      @close="notification.show = false"
    />
    
    <!-- Animated Background -->
    <AnimatedBackground />
    
    <!-- Top Section with Parallax Effect -->
    <div 
      class="relative bg-cover bg-center transition-all duration-700 ease-in-out" 
      :class="{'h-[70vh]': !uploadedFile && !imageFromFilename && !searchingProductName, 'h-[85vh]': uploadedFile || imageFromFilename || searchingProductName}"
      :style="{ backgroundImage: `url(${bgImage})` }"
      ref="topSection"
    >
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
      <div class="absolute inset-0 flex justify-center items-center">
        <div 
          class="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 p-8 rounded-xl shadow-xl w-[500px] max-w-[95%] transform transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 hover:shadow-blue-300/50 dark:hover:shadow-blue-500/20 card-hover mx-4"
          :class="{'scale-100 opacity-100': isLoaded, 'scale-95 opacity-0': !isLoaded}"
        >
          <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-10 relative">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">WCD Vision AI</span>
            <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-blue-500 to-green-400 rounded-full"></div>
          </h1>

          <!-- Product Name Input Component -->
          <div :class="{'transform translate-y-0 opacity-100': isLoaded, 'transform translate-y-4 opacity-0': !isLoaded}" 
               class="transition-all duration-500 ease-in-out delay-100">
            <ProductNameInput 
              @product-name-submitted="fetchRecommendationsByFilename" 
              @product-name-display="handleProductNameDisplay"
            />
          </div>

          <!-- File Upload Component -->
          <div :class="{'transform translate-y-0 opacity-100': isLoaded, 'transform translate-y-4 opacity-0': !isLoaded}" 
               class="transition-all duration-500 ease-in-out delay-200">
            <FileUpload 
              :backendUrl="backendUrl" 
              :activeFile="activeFile"
              @file-uploaded="handleFileUploaded" 
              @recommendations-received="setRecommendations"
              @loading="setLoading"
              @notify="showNotification"
            />
          </div>

          <!-- Product Filters -->  
          <div class="w-full mt-4">
            <div class="filter-controls flex items-center">
              <div class="flex-grow">
                <ProductFilters
                  :isLoaded="isLoaded"
                  :sortCriteria="sortCriteria"
                  :productTypeFilter="productTypeFilter"
                  :availableProductTypes="availableProductTypes"
                  @update:sortCriteria="sortCriteria = $event"
                  @update:productTypeFilter="productTypeFilter = $event"
                  @sort-change="sortRecommendations"
                  @filter-change="applyFilters"
                />
              </div>
              
              <!-- Color Picker Filter Component -->
              <div class="color-picker-button">
                <ColorPickerFilter
                  id="color-picker-button"
                  @color-filter-change="handleColorFilterChange"
                  :class="{'transform translate-y-0 opacity-100': isLoaded, 'transform translate-y-4 opacity-0': !isLoaded}"
                  class="transition-all duration-500 ease-in-out delay-300"
                />
              </div>
            </div>
          </div>

          <!-- Display uploaded file or input image  -->
          <div 
            v-if="uploadedFile || imageFromFilename || searchingProductName" 
            class="mt-6 text-gray-800 transition-all duration-500 ease-in-out"
            :class="{'transform scale-100 opacity-100': displayImageLoaded, 'transform scale-95 opacity-0': !displayImageLoaded}"
          >
            <!-- Input Design label -->
            <div class="mb-4 relative">
              <h3 class="text-xl font-bold text-gray-800 dark:text-white inline-block relative">
                Input Design
              </h3>
            </div>
            
            <div class="h-48 w-full overflow-hidden border border-gray-300 rounded-lg shadow-md relative">
              <!-- Show image if available -->
              <img 
                v-if="uploadedFile || imageFromFilename" 
                :src="uploadedFile || imageFromFilename" 
                alt="Uploaded Image" 
                class="w-full h-full object-cover transition-all duration-500 ease-in-out"
                crossorigin="anonymous" 
                @load="onImageLoad"
                @error="handleImageError"
              />
              
              <!-- Show product name placeholder when searching -->
              <div 
                v-if="searchingProductName && !imageFromFilename && !uploadedFile" 
                class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700"
              >
                <div class="text-center p-4">
                  <div class="animate-pulse mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p class="text-gray-600 dark:text-gray-300 font-medium">Searching for:</p>
                  <p class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ searchingProductName }}</p>
                </div>
              </div>
              
              <button
                v-if="uploadedFile"
                @click="openCropper"
                class="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow-md transition-all duration-300 transform hover:scale-105">
                Crop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section with Recommendations -->
    <div 
      class="p-8 min-h-[50vh] relative bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute left-0 right-0 h-32 bg-gradient-to-b from-white dark:from-gray-900 to-transparent"></div>
        <div class="absolute -bottom-10 -left-10 w-72 h-72 bg-green-200 dark:bg-green-900/30 rounded-full filter blur-3xl opacity-30"></div>
        <div class="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
      </div>
      
      <div class="relative z-10">
        <div class="flex justify-left items-left w-full">  <!-- Center the Header Recommended For you -->
          <h2
            class="font-bold text-black dark:text-white mb-8 text-center relative inline-block"
            style="font-size: 38px; font-family: 'Montserrat', 'Segoe UI', sans-serif; letter-spacing: -0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);"
            ref="recommendationsTitle"
          >
            <span class="relative z-10">Recommended For You</span>
            <div class="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-green-400 rounded-full transform origin-center transition-all duration-500 ease-in-out shadow-sm"
                :style="{transform: titleHighlightWidth}"></div>
          </h2>
        </div>

        <!-- Recommendation List with staggered animation -->
        <RecommendationList 
          :recommendations="filteredRecommendations" 
          :backendUrl="backendUrl"
          :isLoaded="isLoaded"
          :sortCriteria="sortCriteria"
        />
        
        <!-- Export to PDF component -->
        <ExportToPDF :recommendations="recommendations" />
      </div>
    </div>

    <!-- Image Cropper Modal -->
    <Transition name="fade">
      <ImageCropper
        v-if="isCropping"
        :imageUrl="uploadedFile"
        @image-cropped="handleCroppedImage"
        @close="isCropping = false"
      />
    </Transition>
  </div>
</template>

<script>
import axios from "axios";
import { BACKEND_URL } from './config.js';  
import FileUpload from "./components/FileUpload.vue";
import RecommendationList from "./components/RecommendationList.vue";
import ProductNameInput from "./components/ProductNameInput.vue";
import ImageCropper from "./components/ImageCropper.vue";
import ExportToPDF from "./components/ExportToPDF.vue";
import AnimatedBackground from "./components/AnimatedBackground.vue";
import LoadingScreen from "./components/LoadingScreen.vue";
import NotificationToast from "./components/NotificationToast.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import ProductFilters from "./components/ProductFilters.vue";
import ColorPickerFilter from "./components/ColorPickerFilter.vue"; // Import the new component
import bgImage from "@/assets/bg1.jpg";

// Create utils/colorUtils.js file with the color similarity functions
export default {
  components: {
    FileUpload,
    RecommendationList,
    ProductNameInput,
    ImageCropper,
    ExportToPDF,
    AnimatedBackground,
    LoadingScreen,
    NotificationToast,
    ThemeToggle,
    ProductFilters,
    ColorPickerFilter // Register the new component
  },
  data() {
    return {
      backendUrl: BACKEND_URL, 
      uploadedFile: null,         
      imageFromFilename: null,  
      recommendations: [],
      filteredRecommendations: [],
      originalRecommendations: [],
      bgImage,
      sortCriteria: 'similarity',
      productTypeFilter: [], 
      colorFilter: null,
      colorFilterThreshold: 15, 
      isCropping: false,
      activeFile: null,
      isLoaded: false,
      displayImageLoaded: false,
      titleHighlightWidth: 'scaleX(0)',
      observer: null,
      searchingProductName: null,
      lastSearchedFilename: null,
      isLoading: false,
      loadingMessage: 'Loading...',
      notification: {
        show: false,
        type: 'info',
        message: '',
        title: ''
      },
      // update timer to debounce filter changes
      _filterUpdateTimer: null
    };
  },
  computed: {
    availableProductTypes() {
      // Get unique product types from recommendations if available
      if (this.originalRecommendations && this.originalRecommendations.length > 0) {
        const uniqueTypes = [...new Set(this.originalRecommendations
          .map(rec => rec.Product_Type)
          .filter(type => type && type.trim() !== ''))];
        
        // If theres unique types from recommendations, use those
        if (uniqueTypes.length > 0) {
          return uniqueTypes.sort();
        }
      }
      
      // Fallback to predefined list
      return [
        "Korean Wallpaper",
        "Asian Wallpaper",
        "Fabric Accessories",
        "European Wallpaper",
        "Curtain Fabric",
        "Curtain Fabric, Dim Out",
        "Contract Wallpaper",
        "Dim Out",
        "Fabric Backed Wallpaper",
        "Fabric",
        "Korean Wallpaper - 21\"",
        "KIDS Wallpaper",
        "Photomural Wallpaper",
        "Architectural Film",
        "Fabric Upholstery",
        "Velour Fabric",
        "Vinyl Sheet"
      ].sort();
    }
  },
  mounted() {
  setTimeout(() => {
    this.isLoaded = true;
  }, 300);
  
  this.setupIntersectionObserver();
  window.addEventListener('scroll', this.handleScroll);
  
  // Add backend connectivity test
  console.log("Configured backend URL:", this.backendUrl);
  
  // Test connectivity to the backend
  fetch(`${this.backendUrl}/health`)
    .then(response => response.json())
    .then(data => {
      console.log("Backend health check:", data);
      this.showNotification('info', 'Backend Connected', 'Successfully connected to backend API');
    })
    .catch(error => {
      console.error("Backend health check failed:", error);
      this.showNotification('error', 'Backend Connection Failed', 'Could not connect to backend API');
    });
},
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Clear any pending timers
    clearTimeout(this._filterUpdateTimer);
  },
  methods: {
    // Filter methods 
    applyFilters() {
      // Clear any pending updates
      clearTimeout(this._filterUpdateTimer);
      
      // Debounce the filter application to prevent recursive updates
      this._filterUpdateTimer = setTimeout(() => {
        // Skip updating if we don't have original recommendations
        if (!this.originalRecommendations || this.originalRecommendations.length === 0) {
          return;
        }

        // Start with all recommendations
        let filtered = [...this.originalRecommendations];
        
        // Apply product type filter if selected
        if (this.productTypeFilter && this.productTypeFilter.length > 0) {
          filtered = filtered.filter(rec => 
            this.productTypeFilter.includes(rec.Product_Type)
          );
        }
        
        // Apply color filter if selected
        if (this.colorFilter) {
          filtered = this.filterByColorSimilarity(
            filtered, 
            this.colorFilter, 
            this.colorFilterThreshold
          );
        }
        
        // Update filtered recommendations
        this.filteredRecommendations = filtered;
        
        // Apply sorting
        this.sortRecommendations();
      }, 10);
    },
    
    // Handle color filter change from the ColorPickerFilter component
    handleColorFilterChange(colorData) {
      if (colorData === null) {
        // Clear color filter
        this.colorFilter = null;
      } else {
        // Set color filter and threshold
        this.colorFilter = colorData.color;
        this.colorFilterThreshold = colorData.threshold;
      }
      
      // Apply filters
      this.applyFilters();
    },
    
    // Filter recommendations by color similarity
    filterByColorSimilarity(recommendations, targetColor, threshold) {
      if (!targetColor || !recommendations || recommendations.length === 0) {
        return recommendations;
      }
      
      return recommendations.filter(rec => {
        // Get the color value from the recommendation
        const recColorValue = rec.color_code || rec.Color_Code || rec.color || rec.Color;
        if (!recColorValue) return true; // If no color in recommendation, include it
        
        // Parse color values
        const recColor = this.parseColor(recColorValue);
        if (!recColor) return true; // If can't parse the color, include it
        
        // Calculate color distance and check if colors are similar
        return this.areColorsSimilar(targetColor, recColor, threshold);
      });
    },
    
    // Parse different color formats
    parseColor(colorValue) {
      if (!colorValue) return null;
      
      // Handle hex color
      if (typeof colorValue === 'string' && colorValue.startsWith('#')) {
        return this.hexToRgb(colorValue);
      }
      
      // Handle RGB string like "rgb(255, 0, 0)" or "255, 0, 0"
      if (typeof colorValue === 'string') {
        const parts = colorValue.replace(/[^\d,]/g, '').split(',');
        if (parts.length >= 3) {
          return {
            r: parseInt(parts[0].trim()),
            g: parseInt(parts[1].trim()),
            b: parseInt(parts[2].trim())
          };
        }
      }
      
      // Handle RGB object {r, g, b}
      if (typeof colorValue === 'object' && 'r' in colorValue && 'g' in colorValue && 'b' in colorValue) {
        return colorValue;
      }
      
      return null;
    },
    
    // Convert hex to RGB
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },
    
    // Calculate Delta E color difference (simplified)
    colorDistance(color1, color2) {
      // Simple Euclidean distance in RGB space
      return Math.sqrt(
        Math.pow(color1.r - color2.r, 2) +
        Math.pow(color1.g - color2.g, 2) +
        Math.pow(color1.b - color2.b, 2)
      );
    },
    
    // Check if colors are similar based on threshold
    areColorsSimilar(color1, color2, threshold) {
      // Maximum RGB distance is 441.67 (sqrt(255^2 * 3))
      const maxDistance = 441.67;
      // Convert threshold percentage to actual distance
      const distanceThreshold = (threshold / 100) * maxDistance;
      
      return this.colorDistance(color1, color2) <= distanceThreshold;
    },
    
    // Image loaded handler
    onImageLoad() {
      console.log("Image loaded successfully");
      this.displayImageLoaded = true;
      this.searchingProductName = null; // Clear the placeholder when image loads
    },
    
    // Helper to log object fields
    logObjectFields(obj, label = "Object fields") {
      if (!obj) {
        console.log(`${label}: null or undefined`);
        return;
      }
      
      console.log(`${label}:`);
      // Log all keys and their types
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const type = typeof value;
        const preview = type === 'object' ? (value === null ? 'null' : Array.isArray(value) ? `Array(${value.length})` : 'Object') : value;
        console.log(`  - ${key}: ${type}, value: ${preview}`);
      });
    },
    
    // Helper function to get full image URL
    getFullImageUrl(imageUrl) {
      if (!imageUrl) return null;
      
      // If already a full URL, use proxy endpoint
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return `${this.backendUrl}/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      }
      
      // If it starts with a slash, append it to the backend base URL
      if (imageUrl.startsWith('/')) {
        return `${this.backendUrl}${imageUrl}`;
      }
      
      // Otherwise, assume it's a relative path and add a slash
      return `${this.backendUrl}/${imageUrl}`;
    },
    
    setupIntersectionObserver() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === this.$refs.recommendationsTitle) {
              this.titleHighlightWidth = 'scaleX(1)';
            }
          }
        });
      }, { threshold: 0.1 });
      
      if (this.$refs.recommendationsTitle) {
        this.observer.observe(this.$refs.recommendationsTitle);
      }
    },
    
    handleScroll() {
      if (this.$refs.topSection) {
        const scrollPosition = window.scrollY;
        const translateY = scrollPosition * 0.3;
        this.$refs.topSection.style.backgroundPositionY = `calc(50% + ${translateY}px)`;
      }
    },
    
    handleProductNameDisplay(productName) {
      this.imageFromFilename = null;
      this.uploadedFile = null;
      this.displayImageLoaded = true;
      this.searchingProductName = productName;
    },
    
    handleFileUploaded(file) {
      this.imageFromFilename = null;
      this.searchingProductName = null;
      this.activeFile = file;
      this.uploadedFile = URL.createObjectURL(file);
      this.displayImageLoaded = false;
    },
    
    openCropper() {
      this.isCropping = true;
    },
    
    handleCroppedImage(blob) {
      this.isCropping = false;
      const croppedFile = new File([blob], "cropped.jpg", { type: blob.type, lastModified: Date.now() });
      this.activeFile = croppedFile;
      this.uploadedFile = URL.createObjectURL(blob);
      this.displayImageLoaded = false;
    },
    
    setRecommendations(recommendations) {
      // Use timeout to avoid immediate reactivity chain
      setTimeout(() => {
        this.originalRecommendations = recommendations;
        this.recommendations = [...recommendations];
        this.filteredRecommendations = [...recommendations];
        
        // Reset product type filter when new recommendations come in
        this.productTypeFilter = [];
        this.colorFilter = null; // Reset color filter as well
      }, 200);
    },
    
    setLoading(isLoading, message = 'Loading...') {
      this.isLoading = isLoading;
      this.loadingMessage = message;
    },
    
    handleImageError(event) {
      console.error("Image failed to load:", event);
      console.error("Image source that failed:", event.target.src);
      
      // Keep showing the product name placeholder
      this.imageFromFilename = null;
      this.searchingProductName = this.lastSearchedFilename;
      this.displayImageLoaded = true;
      
      this.showNotification('warning', 'Image Display', "Could not load product image.");
    },
    
    fetchRecommendationsByFilename(filename) {
  const uppercaseFilename = filename.toUpperCase();
  this.uploadedFile = null;
  this.displayImageLoaded = false;
  this.lastSearchedFilename = filename;
  
  this.isLoading = true;
  this.loadingMessage = 'Fetching recommendations...';
  
  // Log the backend URL being used for debugging
  console.log(`Making API request to: ${this.backendUrl}/recommendations/filename`);
  
  // Configure axios with explicit CORS headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    withCredentials: false  // Important for CORS requests
  };
  
  // Make the POST request with proper configuration
  axios.post(
    `${this.backendUrl}/recommendations/filename`, 
    { filename: uppercaseFilename },
    config
  )
  .then((response) => {
    console.log("API Response received", response.status);
    
    // Log all fields in response
    this.logObjectFields(response.data, "Response data");
    
    // Try to find the image URL in different possible locations
    let imageUrl = null;
    
    // Check if image_url is directly in the response
    if (response.data.image_url) {
      console.log("Found image_url directly in response:", response.data.image_url);
      imageUrl = response.data.image_url;
    }
    // Check for image in first recommendation
    else if (response.data.recommendations && response.data.recommendations.length > 0) {
      const firstRec = response.data.recommendations[0];
      this.logObjectFields(firstRec, "First recommendation");
      
      // Check for common image field names
      const possibleImageFields = ['Image_1', 'image_url', 'image', 'imageUrl', 'img', 'picture', 'photo'];
      
      for (const field of possibleImageFields) {
        if (firstRec[field]) {
          console.log(`Found image in field: ${field} = ${firstRec[field]}`);
          imageUrl = firstRec[field];
          break;
        }
      }
      
      // If still not found, try to identify potential image fields
      if (!imageUrl) {
        console.log("Searching for potential image fields in recommendation:");
        Object.keys(firstRec).forEach(key => {
          const value = firstRec[key];
          if (typeof value === 'string' && 
              (key.toLowerCase().includes('image') || 
               key.toLowerCase().includes('img') || 
               key.toLowerCase().includes('pic') ||
               (value.toLowerCase && (
                 value.toLowerCase().includes('.jpg') || 
                 value.toLowerCase().includes('.png') || 
                 value.toLowerCase().includes('.jpeg'))))) {
            console.log(`Potential image field: ${key} = ${value}`);
            // Use the first one found as a last resort
            if (!imageUrl) {
              imageUrl = value;
              console.log(`Using ${key} as image URL`);
            }
          }
        });
      }
    }
    
    // If an image URL was found, use it
    if (imageUrl) {
      this.imageFromFilename = this.getFullImageUrl(imageUrl);
      console.log("Set image URL to:", this.imageFromFilename);
    } else {
      console.log("No image URL found in response");
    }
    
    // Update recommendations if present
    if (response.data.recommendations) {
      this.setRecommendations(response.data.recommendations);
      
      // Hide loading and show success notification
      this.isLoading = false;
      this.showNotification('success', 'Success!', `Found ${this.recommendations.length} recommendations for ${filename}`);
    } else {
      this.isLoading = false;
      this.showNotification('warning', 'Warning', "No recommendations found for this product.");
    }
  })
  .catch((error) => {
    console.error("API Error:", error);
    
    // Detailed error logging
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    
    this.isLoading = false;
    
    // Show appropriate error message
    if (error.response && error.response.status === 405) {
      this.showNotification('error', 'Method Not Allowed', 
        "The server doesn't allow this request method. Please check the API configuration.");
    } else if (error.response && error.response.status === 404) {
      this.showNotification('error', 'Not Found', 
        "The product with this code doesn't exist in the database.");
    } else {
      this.showNotification('error', 'Error', 
        "Failed to fetch recommendations. Please try again later.");
    }
  });
},
    
    showNotification(type, title, message) {
      // First clear any existing notification to ensure state is clean
      if (this.notification.show) {
        // If a notification is already showing, reset it first
        this.notification = {
          show: false,
          type: 'info',
          message: '',
          title: ''
        };

        // Use setTimeout to ensure the next notification happens in a separate "tick"
        setTimeout(() => {
          this.notification = {
            show: true,
            type,
            title,
            message
          };
        }, 0);
      } else {
        // No notification showing, we can just set it directly
        this.notification = {
          show: true,
          type,
          title,
          message
        };
      }
    },
    
    sortRecommendations() {
      // Clear any pending updates
      clearTimeout(this._filterUpdateTimer);
      
      // Debounce the sorting to prevent recursive updates
      this._filterUpdateTimer = setTimeout(() => {
        // Skip if no data to sort
        if (!this.filteredRecommendations || this.filteredRecommendations.length === 0) {
          return;
        }

        // Create a new array to avoid reactivity issues
        const sorted = [...this.filteredRecommendations];
        
        if (this.sortCriteria === 'similarity') {
          sorted.sort((a, b) => {
            const valA = typeof a.similarity === 'number' ? a.similarity : 0;
            const valB = typeof b.similarity === 'number' ? b.similarity : 0;
            return valB - valA;
          });
        } else if (this.sortCriteria === 'inventory') {
          sorted.sort((a, b) => {
            const valA = typeof a.inventory_count === 'number' ? a.inventory_count : 0;
            const valB = typeof b.inventory_count === 'number' ? b.inventory_count : 0;
            return valB - valA;
          });
        }
        
        // Assign the sorted array to the filtered recommendations
        this.filteredRecommendations = sorted;
      }, 10);
    }
  },
  watch: {
    // Modify the watch to debounce and prevent immediate triggers
    productTypeFilter: {
      handler() {
        // Debounce the filter application
        clearTimeout(this._filterUpdateTimer);
        this._filterUpdateTimer = setTimeout(() => {
          this.applyFilters();
        }, 10);
      },
      deep: true
    },
    // Watch for changes to the color filter
    colorFilter: {
      handler() {
        clearTimeout(this._filterUpdateTimer);
        this._filterUpdateTimer = setTimeout(() => {
          this.applyFilters();
        }, 10);
      },
      deep: true
    }
  }
};
</script>

<style>
/* Add this for proper PDF generation */
@media print {
  #content-to-export {
    height: auto !important;
    overflow: visible !important;
  }
  
  /* Fix for Tailwind height class */
  div[class*="h-[70vh]"] {
    height: auto !important;
  }
  
  /* Hide elements not needed in PDF */
  button, select, input, form {
    display: none !important;
  }
  
  /* Ensure images are visible */
  img {
    display: block !important;
    max-width: 100% !important;
    page-break-inside: avoid !important;
  }
  
  /* Force background colors to print */
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Card hover animation */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Improved filter dropdown styles */
.filter-dropdown {
  min-width: 150px;
}

.dropdown-portal {
  min-width: 250px !important;
  max-height: 350px;
  overflow-y: auto;
}

/* Fix for dropdown label overflow */
.dropdown-portal label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
  padding-right: 10px;
  line-height: 1.2;
}

.color-picker-button {
  display: inline-flex;
  vertical-align: middle;
  margin-left: 8px;
  height: 38px; /* Match the height of your other dropdowns */
}

.color-picker-button button {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Fix for the ProductFilters component layout */
.filter-controls {
  display: flex;
  align-items: center;
  gap: 8px; /* Provides consistent spacing between elements */
}

/* Ensure the dropdowns have consistent height */
.filter-dropdown button,
.product-line-dropdown button,
.similarity-dropdown button {
  height: 38px;
}

/* For mobile responsiveness */
@media (max-width: 768px) {
  .filter-controls {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .color-picker-button {
    margin-top: 4px;
  }
}

</style>