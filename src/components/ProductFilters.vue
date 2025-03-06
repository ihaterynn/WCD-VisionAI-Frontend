<template>
    <!-- Wrap everything in a single root div -->
    <div class="product-filters-container">
      <div 
        class="mt-6 transition-all duration-500 ease-in-out delay-300 space-y-4"
        :class="{'transform translate-y-0 opacity-100': isLoaded, 'transform translate-y-4 opacity-0': !isLoaded}"
      >
        <!-- Custom flex layout for precise width control -->
        <div class="flex gap-3">
          <!-- Sort Dropdown (slightly wider than before, but not too big) -->
          <div style="width: 28%;">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
            <select 
              v-model="localSortCriteria" 
              @change="emitSortChange" 
              class="p-2 w-full border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300"
            >
              <option value="similarity">Similarity</option>
              <option value="inventory">Inventory</option>
            </select>
          </div>
          
          <!-- Product Type Filter Dropdown (enough space for its content) -->
          <div style="width: 37%;" class="relative dropdown-container" ref="productTypeDropdown">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter Product Type(s)</label>
            <button 
              @click="toggleProductTypeDropdown" 
              class="p-2 w-full border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 text-left flex justify-between items-center"
            >
              <span class="truncate max-w-[85%]">{{ localProductTypeFilter.length ? `${localProductTypeFilter.length} selected` : 'Product Types' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <!-- Product Line Filter Dropdown -->
          <div style="width: 34%;">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Product Line</label>
            <select 
              class="p-2 w-full border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300"
              disabled
            >
              <option value="">Product Lines</option>
              <!-- Will be implemented later -->
            </select>
          </div>
        </div>
      </div>
    
      <!-- Teleport the dropdown menu to body to avoid z-index issues -->
      <teleport to="body">
        <div 
          v-if="showProductTypeDropdown" 
          id="dropdown-portal"
          class="dropdown-portal text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          @click.stop
        >
          <div class="p-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="select-all-types" 
                :checked="localProductTypeFilter.length === availableProductTypes.length" 
                @change="toggleAllProductTypes" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
              >
              <label for="select-all-types" class="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                Select All
              </label>
            </div>
          </div>
          <div class="dropdown-items-container">
            <div 
              v-for="type in availableProductTypes" 
              :key="type" 
              class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  :id="`type-${type}`" 
                  :value="type" 
                  v-model="localProductTypeFilter"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
                >
                <label :for="`type-${type}`" class="ml-2 block text-sm text-gray-900 dark:text-gray-100 whitespace-normal break-words">
                  {{ type }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </teleport>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProductFilters',
    // Keep the emits declaration
    emits: ['update:sortCriteria', 'update:productTypeFilter', 'sort-change', 'filter-change'],
    props: {
      isLoaded: {
        type: Boolean,
        default: false
      },
      sortCriteria: {
        type: String,
        default: 'similarity'
      },
      productTypeFilter: {
        type: Array,
        default: () => []
      },
      availableProductTypes: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        localSortCriteria: this.sortCriteria,
        localProductTypeFilter: [...this.productTypeFilter],
        showProductTypeDropdown: false
      };
    },
    watch: {
      sortCriteria(newVal) {
        if (this.localSortCriteria !== newVal) {
          this.localSortCriteria = newVal;
        }
      },
      productTypeFilter(newVal) {
        // Only update if there's an actual difference to avoid loops
        if (JSON.stringify(this.localProductTypeFilter) !== JSON.stringify(newVal)) {
          this.localProductTypeFilter = [...newVal];
        }
      },
      localProductTypeFilter: {
        handler(newVal, oldVal) {
          // Only emit if there's an actual change and not on initial setup
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.$emit('update:productTypeFilter', [...newVal]);
            this.$emit('filter-change', [...newVal]);
          }
        },
        deep: true
      }
    },
    mounted() {
      document.addEventListener('click', this.closeDropdownOnClickOutside);
    },
    beforeUnmount() {
      document.removeEventListener('click', this.closeDropdownOnClickOutside);
      window.removeEventListener('scroll', this.positionDropdownPortal);
      window.removeEventListener('resize', this.positionDropdownPortal);
    },
    methods: {
      emitSortChange() {
        if (this.localSortCriteria !== this.$props.sortCriteria) {
          this.$emit('update:sortCriteria', this.localSortCriteria);
          this.$emit('sort-change', this.localSortCriteria);
        }
      },
      
      toggleProductTypeDropdown() {
        this.showProductTypeDropdown = !this.showProductTypeDropdown;
        
        if (this.showProductTypeDropdown) {
          // Position the dropdown
          this.$nextTick(() => {
            this.positionDropdownPortal();
          });
          
          // Add event listeners
          window.addEventListener('scroll', this.positionDropdownPortal);
          window.addEventListener('resize', this.positionDropdownPortal);
        } else {
          // Remove event listeners
          window.removeEventListener('scroll', this.positionDropdownPortal);
          window.removeEventListener('resize', this.positionDropdownPortal);
        }
      },
      
      positionDropdownPortal() {
        if (!this.showProductTypeDropdown) return;
        
        requestAnimationFrame(() => {
          const button = this.$refs.productTypeDropdown.querySelector('button');
          const portal = document.getElementById('dropdown-portal');
          
          if (button && portal) {
            const rect = button.getBoundingClientRect();
            
            const dropdownWidth = Math.max(rect.width, 250); 
            
            portal.style.position = 'fixed';
            portal.style.width = `${dropdownWidth}px`;
            portal.style.top = `${rect.bottom + 5}px`;
            portal.style.left = `${rect.left}px`;
            
            const viewportHeight = window.innerHeight;
            const maxDropdownHeight = viewportHeight - rect.bottom - 30;
            portal.style.maxHeight = `${Math.min(400, maxDropdownHeight)}px`;
          }
        });
      },
      
      closeDropdownOnClickOutside(event) {
        const dropdown = this.$refs.productTypeDropdown;
        const portal = document.getElementById('dropdown-portal');
        
        if ((dropdown && !dropdown.contains(event.target)) && 
            (portal && !portal.contains(event.target))) {
          this.showProductTypeDropdown = false;
        }
      },
      
      toggleAllProductTypes(event) {
        const newValue = event.target.checked ? [...this.availableProductTypes] : [];
        // Only update if different to prevent unnecessary updates
        if (JSON.stringify(this.localProductTypeFilter) !== JSON.stringify(newValue)) {
          this.localProductTypeFilter = newValue;
        }
      }
    }
  };
  </script>
  
  <style>
  /* Create a portal layer for dropdowns that sits above everything */
  .dropdown-portal {
    position: fixed;
    z-index: 9999 !important;
    background-color: white;
    border-radius: 0.375rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box !important;
    margin: 0 !important;
    padding: 0 !important;
    border: 1px solid rgba(229, 231, 235, 1);
    min-width: 250px;
    
    animation: dropdownAppear 0.2s ease-out;
  }
  
  @keyframes dropdownAppear {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .dropdown-items-container {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    max-height: 350px;
    overflow-y: auto;
  }
  
  .dropdown-portal::-webkit-scrollbar,
  .dropdown-items-container::-webkit-scrollbar {
    width: 8px;
  }
  
  .dropdown-portal::-webkit-scrollbar-track,
  .dropdown-items-container::-webkit-scrollbar-track {
    background: rgba(243, 244, 246, 0.5);
  }
  
  .dropdown-portal::-webkit-scrollbar-thumb,
  .dropdown-items-container::-webkit-scrollbar-thumb {
    background-color: rgba(209, 213, 219, 0.8);
    border-radius: 4px;
  }
  
  /* Ensures the dropdown container has position relative */
  .dropdown-container {
    position: relative;
  }
  
  /* Dark mode support */
  .dark .dropdown-portal {
    background-color: #1f2937; 
    color: #e5e7eb; 
    border-color: #374151; 
  }
  

  .dropdown-portal .hover\:bg-gray-100:hover {
    background-color: #f3f4f6;
  }
  
  .dark .dropdown-portal .dark\:hover\:bg-gray-700:hover {
    background-color: #374151;
  }
  
  .dark .dropdown-portal .dark\:text-gray-100 {
    color: #f3f4f6;
  }
  
  .dropdown-portal .text-gray-900 {
    color: #111827;
  }
  
  .dropdown-portal label {
    display: block;
    width: calc(100% - 30px); 
    padding-right: 8px;
  }
  
  .dropdown-portal input[type="checkbox"] {
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  @media (max-width: 768px) {
    .dropdown-portal {
      width: calc(100vw - 20px) !important;
      max-width: 350px;
    }
  }
  
  .whitespace-normal {
    white-space: normal;
  }
  
  .break-words {
    word-wrap: break-word;
  }
  </style>