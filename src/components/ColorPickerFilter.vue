<template>
    <div class="relative">
      <!-- Color Picker Button with Icon -->
      <button 
        ref="colorButton"
        @click="toggleColorPicker"
        class="flex items-center justify-center h-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-2 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        :class="{'ring-2 ring-blue-500': isOpen}"
        title="Filter by color"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
          <path d="M12 2C13.3 2 14.6 2.3 15.8 2.7C16.9 3.1 18 3.7 18.9 4.6C19.8 5.4 20.4 6.5 20.8 7.6C21.2 8.8 21.5 10.1 21.5 11.4C21.5 12.7 21.2 14 20.8 15.2C20.4 16.3 19.8 17.4 18.9 18.3L12 12V2Z" fill="#f44336" />
          <path d="M18.9 18.3C18 19.1 16.9 19.8 15.8 20.2C14.6 20.6 13.3 20.9 12 20.9C10.7 20.9 9.4 20.6 8.2 20.2C7.1 19.8 6 19.1 5.1 18.3L12 12L18.9 18.3Z" fill="#2196f3" />
          <path d="M5.1 18.3C4.2 17.4 3.6 16.3 3.2 15.2C2.8 14 2.5 12.7 2.5 11.4C2.5 10.1 2.8 8.8 3.2 7.6C3.6 6.5 4.2 5.4 5.1 4.6L12 12L5.1 18.3Z" fill="#4caf50" />
        </svg>
        <span v-if="selectedColor" class="ml-2 w-4 h-4 rounded-full border border-gray-300" :style="{ backgroundColor: selectedColor }"></span>
      </button>
    </div>
  
    <!-- Use Teleport to move the modal to the body element -->
    <Teleport to="body">
      <!-- Color Picker Modal -->
      <div 
        v-if="isOpen"
        ref="colorPickerModal" 
        class="fixed z-[99999999] p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-72"
        :style="modalStyle"
      >
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Color</h3>
          <button @click="isOpen = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
  
        <!-- Simple Color Picker with Color Wheel -->
        <div class="mb-4">
          <!-- Color wheel -->
          <div class="relative w-full h-48 mb-3 overflow-hidden rounded-lg shadow-inner">
            <div ref="colorWheel" class="w-full h-full cursor-crosshair" @mousedown="startPickingColor" @touchstart="startPickingColorTouch"></div>
            <div 
              class="absolute w-4 h-4 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              :style="{ left: `${pickerPosition.x}px`, top: `${pickerPosition.y}px`, backgroundColor: displayColor }"
            ></div>
          </div>
          
          <!-- Color display -->
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 rounded-md shadow-inner border border-gray-300 dark:border-gray-600 mr-3" :style="{ backgroundColor: displayColor }"></div>
            <input v-model="displayColor" type="text" class="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300" @change="updateColorFromHex" />
          </div>
  
          <!-- Color swatches -->
          <div class="grid grid-cols-5 gap-2 mb-3">
            <button 
              v-for="(color, index) in colorSwatches" 
              :key="index" 
              class="w-8 h-8 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 cursor-pointer transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :style="{ backgroundColor: color }"
              @click="selectSwatch(color)"
            ></button>
          </div>
        </div>
  
        <!-- Similarity Threshold Slider -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Similarity Threshold: {{ similarityThreshold }}%</label>
          <input type="range" v-model.number="similarityThreshold" min="1" max="50" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Higher value = more color variations included</p>
        </div>
  
        <!-- Action Buttons -->
        <div class="flex mt-4 space-x-2">
          <button @click="applyColorFilter" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded-md text-sm font-medium transition-colors duration-300">
            Apply Filter
          </button>
          <button @click="clearColorFilter" class="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-1.5 px-3 rounded-md text-sm font-medium transition-colors duration-300">
            Clear
          </button>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script>
  export default {
    name: 'ColorPickerFilter',
    data() {
      return {
        isOpen: false,
        displayColor: '#4CAF50',
        selectedColor: null,
        similarityThreshold: 15,
        pickerPosition: { x: 0, y: 0 },
        colorSwatches: [
          '#F44336', '#FF9800', '#FFEB3B', '#4CAF50', '#2196F3', 
          '#673AB7', '#795548', '#607D8B', '#9E9E9E', '#000000'
        ],
        wheelContext: null,
        isDragging: false,
        modalStyle: {
          left: '0px',
          top: '0px'
        }
      };
    },
    mounted() {
      document.addEventListener('mousedown', this.handleClickOutside);
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
      document.addEventListener('touchmove', this.handleTouchMove);
      document.addEventListener('touchend', this.handleTouchEnd);
    },
    beforeUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
      document.removeEventListener('touchmove', this.handleTouchMove);
      document.removeEventListener('touchend', this.handleTouchEnd);
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleScroll);
    },
    methods: {
      toggleColorPicker() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
          this.$nextTick(() => {
            this.initColorWheel();
            this.updateModalPosition();
            // Add scroll and resize event listeners when modal is opened
            window.addEventListener('scroll', this.handleScroll);
            window.addEventListener('resize', this.handleScroll);
          });
        } else {
          // Remove event listeners when modal is closed
          window.removeEventListener('scroll', this.handleScroll);
          window.removeEventListener('resize', this.handleScroll);
        }
      },
      
      handleScroll() {
        if (this.isOpen) {
          // Update modal position when scrolling or resizing
          this.updateModalPosition();
        }
      },
      
      updateModalPosition() {
        // Get button position
        const buttonEl = this.$refs.colorButton;
        if (!buttonEl) return;
        
        const rect = buttonEl.getBoundingClientRect();
        
        // For fixed positioning, we use viewport coordinates (no scroll offset)
        this.modalStyle = {
          left: `${rect.right + 50}px`,
          top: `${rect.top - 324}px`
        };
      },
      
      initColorWheel() {
        if (!this.$refs.colorWheel) return;
        
        while (this.$refs.colorWheel.firstChild) {
          this.$refs.colorWheel.removeChild(this.$refs.colorWheel.firstChild);
        }
        
        const canvas = document.createElement('canvas');
        const rect = this.$refs.colorWheel.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        this.$refs.colorWheel.appendChild(canvas);
        
        this.wheelContext = canvas.getContext('2d', { willReadFrequently: true });
        this.drawColorWheel();
        
        this.pickerPosition = {
          x: canvas.width / 2,
          y: canvas.height / 2
        };
      },
      
      drawColorWheel() {
        if (!this.wheelContext) return;
        
        const { width, height } = this.wheelContext.canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 5;
        
        this.wheelContext.clearRect(0, 0, width, height);
        
        // Draw color wheel
        for (let angle = 0; angle < 360; angle++) {
          const startRad = (angle * Math.PI) / 180;
          this.wheelContext.beginPath();
          this.wheelContext.moveTo(centerX, centerY);
          this.wheelContext.lineTo(
            centerX + radius * Math.cos(startRad),
            centerY + radius * Math.sin(startRad)
          );
          
          const gradient = this.wheelContext.createLinearGradient(
            centerX, centerY,
            centerX + radius * Math.cos(startRad),
            centerY + radius * Math.sin(startRad)
          );
          
          gradient.addColorStop(0, 'white');
          gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
          
          this.wheelContext.strokeStyle = gradient;
          this.wheelContext.stroke();
        }
        
        // Add lightness gradient
        const outerRadius = radius + 5;
        const blackGradient = this.wheelContext.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, outerRadius
        );
        blackGradient.addColorStop(0, 'rgba(0,0,0,0)');
        blackGradient.addColorStop(1, 'rgba(0,0,0,0.7)');
        
        this.wheelContext.fillStyle = blackGradient;
        this.wheelContext.beginPath();
        this.wheelContext.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
        this.wheelContext.fill();
      },
      
      getColorAtPosition(x, y) {
        if (!this.wheelContext) return '#000000';
        try {
          const pixel = this.wheelContext.getImageData(x, y, 1, 1).data;
          return `#${this.rgbToHex(pixel[0], pixel[1], pixel[2])}`;
        } catch (e) {
          console.error("Error getting color:", e);
          return '#000000';
        }
      },
      
      rgbToHex(r, g, b) {
        return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
      },
      
      hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        const bigint = parseInt(hex, 16);
        return { 
          r: (bigint >> 16) & 255, 
          g: (bigint >> 8) & 255, 
          b: bigint & 255 
        };
      },
      
      startPickingColor(event) {
        this.isDragging = true;
        this.updateColorFromEvent(event);
      },
      
      startPickingColorTouch(event) {
        this.isDragging = true;
        event.preventDefault();
        this.updateColorFromTouchEvent(event);
      },
      
      handleMouseMove(event) {
        if (this.isDragging) this.updateColorFromEvent(event);
      },
      
      handleTouchMove(event) {
        if (this.isDragging) {
          event.preventDefault();
          this.updateColorFromTouchEvent(event);
        }
      },
      
      handleMouseUp() {
        this.isDragging = false;
      },
      
      handleTouchEnd() {
        this.isDragging = false;
      },
      
      updateColorFromEvent(event) {
        if (!this.$refs.colorWheel || !this.wheelContext) return;
        
        const rect = this.$refs.colorWheel.getBoundingClientRect();
        const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));
        
        this.pickerPosition = { x, y };
        this.displayColor = this.getColorAtPosition(x, y);
      },
      
      updateColorFromTouchEvent(event) {
        if (!this.$refs.colorWheel || !this.wheelContext || !event.touches[0]) return;
        
        const rect = this.$refs.colorWheel.getBoundingClientRect();
        const touch = event.touches[0];
        const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(touch.clientY - rect.top, rect.height));
        
        this.pickerPosition = { x, y };
        this.displayColor = this.getColorAtPosition(x, y);
      },
      
      updateColorFromHex() {
        if (!/^#[0-9A-F]{6}$/i.test(this.displayColor)) {
          this.displayColor = '#4CAF50';
        }
      },
      
      selectSwatch(color) {
        this.displayColor = color;
      },
      
      applyColorFilter() {
        const rgb = this.hexToRgb(this.displayColor);
        if (rgb) {
          this.selectedColor = this.displayColor;
          this.$emit('color-filter-change', {
            color: rgb,
            threshold: this.similarityThreshold
          });
          this.isOpen = false;
        }
      },
      
      clearColorFilter() {
        this.selectedColor = null;
        this.$emit('color-filter-change', null);
        this.isOpen = false;
      },
      
      handleClickOutside(event) {
        if (this.isOpen && this.$refs.colorPickerModal && !this.$refs.colorPickerModal.contains(event.target) && this.$refs.colorButton && !this.$refs.colorButton.contains(event.target)) {
          this.isOpen = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }
  
  /* Media query for mobile responsiveness */
  @media (max-width: 768px) {
    /* different positioning on mobile */
    :deep(.fixed[style*="left"][style*="top"]) {
      left: auto !important;
      right: 0 !important;
      top: calc(100% + 0.5rem) !important; 
      transform: none !important;
      margin-left: 0 !important;
    }
  }
  </style>