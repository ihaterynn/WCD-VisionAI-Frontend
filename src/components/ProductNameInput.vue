<template>
  <div class="mb-4">
    <div class="relative">
      <input
        type="text"
        v-model="filename"
        placeholder="Enter Product SKU"
        class="border border-gray-300 rounded-lg p-3 w-full pr-10 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 ease-in-out"
        @keyup.enter="submitFilename"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
    <button
      @click="submitFilename"
      class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg p-3 mt-3 w-full font-medium shadow-md hover:shadow-lg transform transition-all duration-300 ease-in-out hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <span class="flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Get Recommendations
      </span>
    </button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filename: "",
    };
  },
  methods: {
    submitFilename() {
      if (this.filename.trim()) {
        console.log("Submitting filename:", this.filename);  
        // First emit the display event to immediately update the UI
        this.$emit("product-name-display", this.filename.trim());
        // Then emit the API call event
        this.$emit("product-name-submitted", this.filename.trim());
      } else {
        alert("Please enter a valid product name.");
      }
    }
  },
};
</script>