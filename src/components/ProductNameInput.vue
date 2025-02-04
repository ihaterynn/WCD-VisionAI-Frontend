<template>
    <div class="mb-4">
      <input
        type="text"
        v-model="filename"
        placeholder="Enter Product Name"
        class="border border-gray-300 rounded-lg p-2 w-full"
      />
      <button
        @click="submitFilename"
        class="bg-blue-500 text-white rounded-lg p-2 mt-2 w-full"
      >
        Get Recommendations
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
            console.log("Submitting filename:", this.filename);  // Add this for debugging
            this.$emit("product-name-submitted", this.filename.trim());
        } else {
            alert("Please enter a valid product name.");
        }
        }
    },
  };
  </script>
  
