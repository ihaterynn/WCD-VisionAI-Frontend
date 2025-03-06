<template>
  <div v-if="sortedRecommendations.length" class="mt-6">
    <!-- Grid Layout with Staggered Animation -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="(rec, index) in sortedRecommendations"
        :key="rec.filename"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg p-4 h-100 flex flex-col transform transition-all duration-500 ease-in-out hover:scale-[1.02] relative"
        :class="{ 
          'animate-card-enter': true,
          'opacity-0 translate-y-10': !showCards
        }"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <!-- More Views Button (moved to top-right of recommendation box) -->
        <ImageGallery
          v-if="rec.additional_images && rec.additional_images.length > 0"
          :main-image="processImageUrl(rec.image_url)"
          :additional-images="rec.additional_images.map(img => processImageUrl(img))"
          :product-name="rec.filename"
          class="absolute top-2 right-2 z-10"
        />
        
        <!-- Image Container with fixed height and hover effect -->
        <a :href="rec.url" target="_blank" class="block h-60 overflow-hidden rounded-md group">
          <img
            :src="processImageUrl(rec.image_url)"
            alt="Recommended Image"
            class="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            crossorigin="anonymous"
          />
        </a>
        
        <!-- Metadata displayed in the desired order -->
        <div class="mt-3 text-center flex-grow flex flex-col justify-center">
          <p class="font-semibold text-gray-800 dark:text-white text-lg mb-2">{{ rec.filename }}</p>
          
          <div class="space-y-1">
            <div class="flex items-center justify-center">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">Product Type:</span>
              <span class="text-sm text-gray-700 dark:text-gray-200">{{ rec.Product_Type }}</span>
            </div>
            
            <div class="flex items-center justify-center">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">UOM:</span>
              <span class="text-sm text-gray-700 dark:text-gray-200">{{ rec.UOM }}</span>
            </div>
            
            <div class="flex items-center justify-center">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">Inventory:</span>
              <span 
                class="text-sm font-semibold"
                :class="getInventoryColorClass(rec.inventory_count)"
              >
                {{ formatInventoryDisplay(rec.inventory_count) }}
              </span>
            </div>
            
            <div class="flex items-center justify-center">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">Similarity:</span>
              <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                <div 
                  class="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-500 ease-out"
                  :style="{ width: `${rec.similarity}%`, opacity: showProgressBars ? 1 : 0 }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="isLoaded" class="flex flex-col items-center justify-center py-16 animate-fade-in">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <p class="text-gray-500 text-lg">No recommendations to display yet.</p>
    <p class="text-gray-400">Upload an image or enter a product name to see recommendations.</p>
  </div>
</template>
<script>
import ImageGallery from './ImageGallery.vue';

export default {
  components: {
    ImageGallery
  },
  props: {
    recommendations: {
      type: Array,
      default: () => [],
    },
    backendUrl: {
      type: String,
      default: () => 'http://127.0.0.1:8080'
    },
    isLoaded: {
      type: Boolean,
      default: false
    },
    sortCriteria: {
      type: String,
      default: 'similarity'
    }
  },
  data() {
    return {
      showCards: false,
      showProgressBars: false
    }
  },
  computed: {
    sortedRecommendations() {
      // Create a copy of recommendations to avoid mutating the original array
      const recommendations = [...this.recommendations];
      
      if (this.sortCriteria === 'similarity') {
        return recommendations.sort((a, b) => b.similarity - a.similarity);
      } else if (this.sortCriteria === 'inventory') {
        return recommendations.sort((a, b) => {
          // Use the existing extractNumericValue method
          const numA = this.extractNumericValue(a.inventory_count);
          const numB = this.extractNumericValue(b.inventory_count);
          
          // Compare numeric values
          return numB - numA;
        });
      }
      
      return recommendations;
    }
  },
  
  watch: {
    recommendations: {
      handler(newVal) {
        if (newVal.length > 0) {
          // Reset animation states first
          this.showCards = false;
          this.showProgressBars = false;
          
          // Trigger animations after a short delay
          setTimeout(() => {
            this.showCards = true;
            
            // Slightly delay the progress bar animations
            setTimeout(() => {
              this.showProgressBars = true;
            }, 800);
          }, 100);
        }
      },
      immediate: true
    }
  },
  mounted() {
    // Trigger animations if there are already recommendations on initial render
    if (this.recommendations.length > 0) {
      setTimeout(() => {
        this.showCards = true;
        
        setTimeout(() => {
          this.showProgressBars = true;
        }, 800);
      }, 100);
    }
  },
  methods: {
    processImageUrl(url) {
      if (!url) return '';
     
      // Skip if already proxied
      if (url.includes('/proxy-image')) return url;
     
      // Skip local URLs
      if (url.includes('127.0.0.1') || url.includes('localhost')) return url;
     
      // Proxy external URLs
      if (url.startsWith('http')) {
        return `${this.backendUrl}/proxy-image?url=${encodeURIComponent(url)}`;
      }
     
      return url;
    },
    
    isTextInventory(inventory) {
      if (!inventory) return false;
      const text = String(inventory).toLowerCase();
      return text.includes('available') || text.includes('heavy') || text.includes('stock');
    },
    
    extractNumericValue(inventoryStr) {
      if (!inventoryStr) return 0;
      
      // Convert to string to handle potential non-string inputs
      const str = String(inventoryStr).toLowerCase();
      
      // If it contains "available" or "heavy stock", assign high values
      if (str.includes('heavy') && str.includes('stock')) {
        return 999;
      } else if (str.includes('available')) {
        // Check if there's a number after "Available"
        const matches = str.match(/available\s*(\d+(\.\d+)?)/i);
        return matches ? parseFloat(matches[1]) : 500;
      }
      
      // Try to extract the first non-zero number
      const numberMatches = str.match(/(\d+(\.\d+)?)/g);
      
      if (numberMatches) {
        // Find the first non-zero number
        for (const match of numberMatches) {
          const num = parseFloat(match);
          if (num > 0) {
            return num;
          }
        }
      }
      
      // If no non-zero number found
      return 0;
    },
    
    formatInventoryDisplay(inventory) {
      if (!inventory) return '0';
      
      const inventoryText = String(inventory);
      
      // Extract number if it exists
      const matches = inventoryText.match(/(\d+(\.\d+)?(\+)?)/);
      if (matches) {
        return matches[0]; // Return just the number with any '+' suffix
      }
      
      // If no number found, just return the original text
      return inventoryText;
    },
    
    getInventoryColorClass(inventory) {
      // If inventory is null, undefined, or effectively zero, return red
      if (!inventory || 
          inventory === '' || 
          inventory === '0' || 
          /^0+(\.\d+)?$/.test(String(inventory).trim())) {
        return 'text-red-600 dark:text-red-400';
      }
      
      const inventoryText = String(inventory).toLowerCase().trim();
      
      // First check for text values like "Available" or "Heavy Stock"
      if (this.isTextInventory(inventoryText)) {
        // Check if it's just "Available" with zero
        if (inventoryText.includes('available') && 
            inventoryText.startsWith('0')) {
          return 'text-red-600 dark:text-red-400';
        }
        return 'text-green-600 dark:text-green-400';
      }
      
      // Extract numeric value for comparison
      const extractedNum = this.extractNumericValue(inventoryText);
      
      // Explicitly check for 0 or very low numbers
      if (extractedNum <= 0) {
        return 'text-red-600 dark:text-red-400';
      }
      
      // Use the extracted number for the threshold 
      if (extractedNum >= 15) {
        return 'text-green-600 dark:text-green-400';
      } else {
        return 'text-red-600 dark:text-red-400';
      }
    }
  }
};  

</script>

<style scoped>
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-card-enter {
  animation: cardEnter 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>