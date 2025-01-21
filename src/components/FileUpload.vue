<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <!-- File Input and Submit Button in Flexbox -->
    <div class="flex items-center space-x-4">
      <input
        type="file"
        @change="handleFileUpload"
        accept="image/*"
        class="block text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-900 hover:file:bg-gray-300"
        required
      />
      <button
        type="submit"
        :disabled="isSubmitting"
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
      >
        Search
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-red-600 font-bold">
      {{ error }}
    </div>
  </form>
</template>

<script>
import axios from "axios";

export default {
  props: ["backendUrl"],
  data() {
    return {
      file: null,
      isSubmitting: false,
      error: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
      this.$emit("file-uploaded", this.file); // Emit event to notify parent of the uploaded file
    },
    async submitForm() {
      if (!this.file) {
        this.error = "Please select a file.";
        return;
      }

      this.isSubmitting = true;
      this.error = null;

      const formData = new FormData();
      formData.append("file", this.file);

      try {
        // Send the file to the backend and emit recommendations
        const response = await axios.post(
          `${this.backendUrl}/recommendations/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.recommendations) {
          this.$emit("recommendations-received", response.data.recommendations); // Emit event to send recommendations back to parent
        } else {
          this.error = "No recommendations received.";
        }
      } catch (err) {
        console.error(err);
        this.error = err.response?.data?.error || "Error during upload.";
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

