<template>
    <div>
      <!-- Export to PDF Button with fixed position -->
      <button 
        @click="exportToPDF" 
        class="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 fixed bottom-4 right-4"
      >
        Export to PDF
      </button>
    </div>
  </template>
  
  <script>
  import html2pdf from 'html2pdf.js'; 
  
  export default {
    props: {
      recommendations: Array,
    },
    methods: {
      exportToPDF() {
        const element = document.getElementById('content-to-export'); 
  
        const opt = {
          margin:       1,
          filename:     'Similar Recommendations.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 6, useCORS: true }, 
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
  
        html2pdf().from(element).set(opt).save();
      }
    }
  };
  </script>
  
  <style scoped>
  /* button stays fixed at the bottom-right of the viewport */
  .fixed {
    position: fixed;
    bottom: 4rem; /* vertical distance from the bottom */
    right: 1rem;  /* horizontal distance from the right */
  }
  </style>
  