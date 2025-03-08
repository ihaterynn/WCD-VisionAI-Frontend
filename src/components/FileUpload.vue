<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <!-- File Input and Submit Button in Flexbox -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
      <div class="relative flex-grow group">
        <input
          type="file"
          @change="handleFileUpload"
          accept="image/*"
          class="block w-full text-sm text-gray-900 
                file:mr-4 file:py-2.5 file:px-4 
                file:rounded-lg file:border-0 
                file:text-sm file:font-medium 
                file:bg-gradient-to-r file:from-blue-400 file:to-blue-500 
                file:text-white file:transition-all file:duration-300
                file:shadow-sm hover:file:shadow-md
                file:cursor-pointer hover:file:bg-gradient-to-r hover:file:from-blue-500 hover:file:to-blue-600
                focus:outline-none cursor-pointer"
          required
        />
        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 to-green-300 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </div>
      
      <button
        type="submit"
        :disabled="isSubmitting"
        class="flex-shrink-0 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        <span class="flex items-center justify-center">
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {{ isSubmitting ? 'Searching...' : 'Search' }}
        </span>
      </button>
    </div>
    
    <!-- Error Message with Animation -->
    <transition name="fade">
      <div v-if="error" class="text-red-600 font-medium bg-red-50 p-3 rounded-lg border-l-4 border-red-500 animate-pulse">
        {{ error }}
      </div>
    </transition>
  </form>
</template>

<script>
import axios from "axios";

export default {
  props: {
    backendUrl: {
      type: String,
      required: true
    },
    // prop to override the file with a cropped version
    activeFile: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      file: null,
      isSubmitting: false,
      error: null,
    };
  },
  mounted() {
  // Check if backendUrl is properly set up
  if (!this.backendUrl || this.backendUrl === '/api') {
    console.error("FileUpload component received invalid backendUrl:", this.backendUrl);
    this.$emit("notify", "error", "Configuration Error", 
      "Backend URL is not properly configured. Please check your environment variables.");
  } else {
    console.log("FileUpload component mounted with valid backendUrl:", this.backendUrl);
    
    // Test connectivity to the backend
    fetch(`${this.backendUrl}/health`)
      .then(response => response.json())
      .then(data => {
        console.log("FileUpload component health check:", data);
      })
      .catch(error => {
        console.error("FileUpload component health check failed:", error);
      });
  }
},
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
      this.$emit("file-uploaded", this.file); // notify parent of the uploaded file
    },
    // Inside FileUpload.vue, update the submitForm method
async submitForm() {
  // use the activeFile from props otherwise fall back to the originally uploaded file
  const fileToUpload = this.activeFile ? this.activeFile : this.file;
  if (!fileToUpload) {
    this.error = "Please select a file.";
    return;
  }
  
  this.isSubmitting = true;
  this.error = null;
  
  // Show loading screen
  this.$emit("loading", true, "Processing image...");
  
  const formData = new FormData();
  formData.append("file", fileToUpload);
  
  // Log the actual backend URL being used - using the full URL from props
  console.log("Backend URL for file upload:", this.backendUrl);
  console.log(`Making file upload request to: ${this.backendUrl}/recommendations/`);
  
  try {
    // Check if backendUrl is defined and not a relative path
    if (!this.backendUrl || this.backendUrl === '/api') {
      throw new Error("Invalid backend URL. Please check your configuration.");
    }
    
    const response = await axios.post(
      `${this.backendUrl}/recommendations/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: false // Important for CORS
      }
    );
    
    console.log("Upload response received:", response.status);
    
    if (response.data.recommendations && response.data.recommendations.length > 0) {
      this.$emit("recommendations-received", response.data.recommendations);
      this.$emit("notify", "success", "Success!", `Found ${response.data.recommendations.length} recommendation(s)`);
    } else {
      this.error = "No recommendations found for this image.";
      this.$emit("notify", "warning", "No Results", "No recommendations were found for this image.");
    }
  } catch (err) {
    console.error("Upload error:", err);
    
    // Enhanced error logging
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
      console.error("Response headers:", err.response.headers);
    } else if (err.request) {
      console.error("No response received:", err.request);
    } else {
      console.error("Error message:", err.message);
    }
    
    this.error = err.response?.data?.detail || err.response?.data?.error || 
                  err.message || "Error during upload.";
    
    this.$emit("notify", "error", "Upload Failed", this.error);
  } finally {
    this.isSubmitting = false;
    // Hide loading screen
    this.$emit("loading", false);
  }
},
    // Helper method to test backend connectivity
    async testBackendConnection() {
      console.log("Testing connection to:", this.backendUrl);
      try {
        const response = await axios.get(`${this.backendUrl}/health`);
        console.log("Backend health check successful:", response.data);
        return true;
      } catch (error) {
        console.error("Backend health check failed:", error);
        return false;
      }
    }
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>