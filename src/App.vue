<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top Section with Background -->
    <div
      class="relative h-[70vh] bg-cover bg-center"
      :style="{ backgroundImage: `url(${bgImage})` }"
    >
      <!-- White Container Over Background -->
      <div class="absolute inset-0 flex justify-center items-center">
        <div class="text-center bg-white p-6 rounded-lg shadow-md w-[420px]">
          <h1 class="text-2xl font-bold text-black mb-6">WCD Similarity Search</h1>

          <!-- File Upload Component -->
          <FileUpload
            :backendUrl="backendUrl"
            @file-uploaded="handleFileUploaded"
            @recommendations-received="setRecommendations"
          />

          <!-- display uploaded file -->
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
        </div>
      </div>
    </div>

    <!-- Bottom Section with Recommendation Grid -->
    <div class="p-6 bg-green-50">
      <h2 class="font-bold text-gray-800 mb-5 text-center" style="font-size: 30px;">Recommended For You</h2>
      <!-- Add the RecommendationList component here -->
      <RecommendationList :recommendations="recommendations" />
    </div>
  </div>
</template>

<script>
import FileUpload from "./components/FileUpload.vue";
import RecommendationList from "./components/RecommendationList.vue"; // Import the RecommendationList component
import bgImage from "@/assets/bg1.jpg";

export default {
  components: {
    FileUpload,
    RecommendationList, // Register RecommendationList here
  },
  data() {
    return {
      backendUrl: "http://127.0.0.1:8000", // Backend server URL
      uploadedFile: null,
      recommendations: [], 
      bgImage, 
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
