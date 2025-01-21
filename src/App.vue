<template>
  <div class="min-h-screen bg-green-50 flex justify-center items-center">
    <!-- White Container -->
    <div class="text-center bg-white p-6 rounded-lg shadow-md w-[420px] h-auto">
      <h1 class="text-2xl font-bold text-black mb-6">WCD Similarity Search</h1>

      <!-- File Upload Component -->
      <FileUpload
        :backendUrl="backendUrl"
        @file-uploaded="handleFileUploaded"
        @recommendations-received="setRecommendations"
      />

      <!-- Display uploaded file -->
      <div v-if="uploadedFile" class="mt-6 text-black">
        <p class="text-lg font-semibold mb-3"><strong>Input Design:</strong></p>
        <div class="h-48 w-full overflow-hidden border border-gray-300 rounded-md">
          <img
            :src="uploadedFile"
            alt="Uploaded Image"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Recommendation List Component -->
      <RecommendationList :recommendations="recommendations" />
    </div>
  </div>
</template>

<script>
import FileUpload from "./components/FileUpload.vue";
import RecommendationList from "./components/RecommendationList.vue";

export default {
  components: {
    FileUpload,
    RecommendationList,
  },
  data() {
    return {
      backendUrl: "http://127.0.0.1:5000", // Backend server URL
      uploadedFile: null,
      recommendations: [], 
    };
  },
  methods: {
    handleFileUploaded(file) {
      this.uploadedFile = URL.createObjectURL(file);
    },
    setRecommendations(recommendations) {
      this.recommendations = recommendations;
    },
  },
};
</script>
