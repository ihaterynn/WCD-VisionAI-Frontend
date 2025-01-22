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
      <div class="max-w-7xl mx-auto mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="(rec, index) in recommendations"
          :key="index"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 p-4"
        >
          <!-- If URL exists, make image clickable -->
          <a :href="rec.url" target="_blank" v-if="rec.url">
            <img
              :src="rec.image_url"
              alt="Recommended Image"
              class="w-full h-48 object-cover rounded-md"
            />
          </a>
          <!-- If URL doesn't exist, render the image without a link -->
          <img
            v-else
            :src="rec.image_url"
            alt="Recommended Image"
            class="w-full h-48 object-cover rounded-md"
          />
          <div class="mt-2 text-center">
            <p class="font-semibold text-gray-800">{{ rec.filename }}</p>
            <p class="text-sm text-gray-600">Similarity: {{ rec.similarity.toFixed(4) }}</p>
            <p v-if="rec.url">
              <a :href="rec.url" target="_blank" class="text-blue-600">View Product</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from "./components/FileUpload.vue";
import bgImage from "@/assets/bg1.jpg";

export default {
  components: {
    FileUpload,
  },
  data() {
    return {
      backendUrl: "http://127.0.0.1:5000", // Backend server URL
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
