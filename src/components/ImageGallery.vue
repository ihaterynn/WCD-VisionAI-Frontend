<template>
    <div>
      <!-- Image Gallery Button -->
      <button 
        v-if="additionalImages && additionalImages.length > 0"
        @click="openGallery" 
        class="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2 shadow-md flex items-center transition-all duration-300 transform hover:scale-105"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-xs">More Views ({{ additionalImages.length }})</span>
      </button>
  
      <!-- Image Gallery Modal Overlay (Teleported to body) -->
      <Teleport to="body">
        <div 
          v-if="showGallery" 
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300"
          @click.self="closeGallery"
        >
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-4xl w-full max-h-[90vh] flex flex-col">
            <!-- Header with title and close button -->
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ productName }} - All Views</h3>
              <button 
                @click="closeGallery"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <!-- Main content area with main image display -->
            <div class="flex-1 overflow-hidden">
              <div class="relative h-[50vh] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  :src="allImages[currentImageIndex]" 
                  class="w-full h-full object-contain"
                  alt="Product view"
                />
                
                <!-- Navigation arrows -->
                <button 
                  v-if="allImages.length > 1"
                  @click="prevImage" 
                  class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  v-if="allImages.length > 1"
                  @click="nextImage" 
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <!-- Image counter -->
                <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
                  {{ currentImageIndex + 1 }} / {{ allImages.length }}
                </div>
              </div>
            </div>
  
            <!-- Thumbnail strip -->
            <div class="mt-4 flex space-x-2 overflow-x-auto py-2">
              <div 
                v-for="(img, index) in allImages" 
                :key="index"
                @click="currentImageIndex = index"
                class="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer transition-all duration-200 transform hover:scale-105"
                :class="{'ring-2 ring-blue-500': currentImageIndex === index}"
              >
                <img :src="img" class="w-full h-full object-cover" alt="Thumbnail" />
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ImageGallery',
    props: {
      mainImage: {
        type: String,
        required: true
      },
      additionalImages: {
        type: Array,
        default: () => []
      },
      productName: {
        type: String,
        default: 'Product'
      }
    },
    data() {
      return {
        showGallery: false,
        currentImageIndex: 0
      }
    },
    computed: {
      allImages() {
        // Combine main image with additional images
        return [this.mainImage, ...this.additionalImages].filter(Boolean);
      }
    },
    methods: {
      openGallery() {
        this.showGallery = true;
        this.currentImageIndex = 0;
        // Prevent background scrolling when gallery is open
        document.body.style.overflow = 'hidden';
        
        // Add event listener for keyboard navigation
        window.addEventListener('keydown', this.handleKeyDown);
      },
      closeGallery() {
        this.showGallery = false;
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
        
        // Remove event listener when gallery closes
        window.removeEventListener('keydown', this.handleKeyDown);
      },
      nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.allImages.length;
      },
      prevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.allImages.length) % this.allImages.length;
      },
      handleKeyDown(e) {
        if (e.key === 'ArrowRight') {
          this.nextImage();
        } else if (e.key === 'ArrowLeft') {
          this.prevImage();
        } else if (e.key === 'Escape') {
          this.closeGallery();
        }
      }
    },
    // Cleanup event listener if component is destroyed while gallery is open
    beforeUnmount() {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }
  </script>