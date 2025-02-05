<template>
  <div class="min-h-screen flex flex-col" id="content-to-export">
    <!-- Top Section with Background -->
    <div class="relative h-[70vh] bg-cover bg-center" :style="{ backgroundImage: `url(${bgImage})` }">
      <!-- White Container Over Background -->
      <div class="absolute inset-0 flex justify-center items-center">
        <div class="text-center bg-white p-6 rounded-lg shadow-md w-[420px]">
          <h1 class="text-2xl font-bold text-black mb-6">WCD Similarity Search</h1>

          <!-- Product Name Input Component -->
          <ProductNameInput @product-name-submitted="fetchRecommendationsByFilename" />

          <!-- File Upload Component -->
          <FileUpload :backendUrl="backendUrl" @file-uploaded="handleFileUploaded" @recommendations-received="setRecommendations" />

          <!-- Dropdown for Sorting -->
          <div class="mt-4">
            <select v-model="sortCriteria" @change="sortRecommendations" class="p-2 border border-gray-300 rounded">
              <option value="similarity">Sort by Similarity</option>
              <option value="inventory">Sort by Inventory</option>
            </select>
          </div>

          <!-- Display uploaded file or input image -->
          <div v-if="uploadedFile || imageFromFilename" class="mt-6 text-black">
            <p class="text-lg font-semibold mb-3"><strong>Input Design:</strong></p>
            <div class="h-48 w-full overflow-hidden border border-gray-300 rounded-md">
              <img :src="uploadedFile || imageFromFilename" alt="Uploaded Image" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section with Recommendation Grid -->
    <div class="p-6 bg-green-50">
      <h2 class="font-bold text-gray-800 mb-5 text-center" style="font-size: 30px;">Recommended For You</h2>
      <!-- Add the RecommendationList component -->
      <RecommendationList :recommendations="recommendations" />
    </div>
  </div>
</template>

<script>
import axios from "axios"; 
import FileUpload from "./components/FileUpload.vue";
import RecommendationList from "./components/RecommendationList.vue";
import ProductNameInput from "./components/ProductNameInput.vue";
import bgImage from "@/assets/bg1.jpg";

export default {
  components: {
    FileUpload,
    RecommendationList,
    ProductNameInput,
  },
  data() {
    return {
      backendUrl: "http://127.0.0.1:8000", 
      uploadedFile: null,
      imageFromFilename: null,  
      recommendations: [],
      bgImage,
      sortCriteria: 'similarity',  // Default sorting criteria
    };
  },
  methods: {
    handleFileUploaded(file) {
      this.imageFromFilename = null;
      this.uploadedFile = URL.createObjectURL(file);
    },
    setRecommendations(recommendations) {
      this.recommendations = recommendations;
    },
    fetchRecommendationsByFilename(filename) {
      axios
        .post(`${this.backendUrl}/recommendations/filename`, { filename })
        .then((response) => {
          this.imageFromFilename = response.data.image_url;
          this.recommendations = response.data.recommendations;
          this.sortRecommendations();  // Sort recommendations when they are received
        })
        .catch((error) => {
          alert("Error: The filename does not exist or is not available.");
        });
    },
    sortRecommendations() {
      if (this.sortCriteria === 'similarity') {
        this.recommendations.sort((a, b) => b.similarity - a.similarity);
      } else if (this.sortCriteria === 'inventory') {
        this.recommendations.sort((a, b) => b.inventory_count - a.inventory_count);
      }
    },
  },
};
</script>
