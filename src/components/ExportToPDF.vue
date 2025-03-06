<template>
  <div class="fixed bottom-4 right-4 z-50">
    <button
      @click="exportToPDF"
      @mouseenter="onHover = true"
      @mouseleave="onHover = false"
      :disabled="isGenerating"
      class="
        relative 
        flex items-center justify-center 
        bg-blue-500 
        text-white 
        px-6 
        py-3 
        rounded-full 
        shadow-lg 
        hover:shadow-xl 
        transition-all 
        duration-300 
        transform 
        hover:-translate-y-1 
        focus:outline-none 
        focus:ring-2 
        focus:ring-blue-400 
        focus:ring-opacity-50
        group
        overflow-hidden
        dark:bg-blue-600 
        dark:hover:bg-blue-500
      "
    >
      <!-- Loading Spinner -->
      <div 
        v-if="isGenerating" 
        class="absolute inset-0 flex items-center justify-center bg-blue-500 dark:bg-blue-600"
      >
        <svg 
          class="animate-spin h-5 w-5 text-white" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            class="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="4"
          ></circle>
          <path 
            class="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

      <!-- Button Content -->
      <div 
        class="
          flex items-center 
          transition-all 
          duration-300 
          transform 
          group-hover:scale-105
        "
        :class="{'opacity-0': isGenerating, 'opacity-100': !isGenerating}"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span class="font-medium">
          {{ isGenerating ? 'Generating...' : 'Export to PDF' }}
        </span>
      </div>

      <!-- Hover Effect -->
      <div 
        v-if="onHover && !isGenerating"
        class="
          absolute 
          inset-0 
          bg-blue-400 
          dark:bg-blue-500 
          opacity-20 
          animate-pulse
        "
      ></div>
    </button>

    <!-- Success Notification -->
    <transition 
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div 
        v-if="showSuccessNotification" 
        class="
          absolute 
          top-full 
          mt-2 
          right-0 
          bg-green-100 
          text-green-800 
          px-4 
          py-2 
          rounded-md 
          shadow-lg
          text-sm
          dark:bg-green-900 
          dark:text-green-200
        "
      >
        PDF Generated Successfully!
      </div>
    </transition>
  </div>
</template>
 
<script>
import html2pdf from 'html2pdf.js';
 
export default {
  props: {
    recommendations: Array,
  },
  data() {
    return {
      isGenerating: false,
      onHover: false,
      showSuccessNotification: false
    };
  },
  methods: {
    exportToPDF() {
      this.isGenerating = true;
     
      // Wait for images to load
      const element = document.getElementById('content-to-export');
     
    
      const tempHeight = element.style.height;
      element.style.height = 'auto';
     
      const opt = {
        margin: 0.5,
        filename: 'Similar Recommendations.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          scrollY: 0,
          windowHeight: element.scrollHeight
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
      };
     
      // wait for processing to complete
      html2pdf().from(element).set(opt).save().then(() => {
        this.isGenerating = false;
        this.showSuccessNotification = true;
        element.style.height = tempHeight;

        // Hide success notification after 3 seconds
        setTimeout(() => {
          this.showSuccessNotification = false;
        }, 3000);
      }).catch(err => {
        console.error('PDF generation error:', err);
        this.isGenerating = false;
        element.style.height = tempHeight;
        alert('Error generating PDF. Please try again.');
      });
    }
  }
};
</script>
 
<style scoped>

</style>