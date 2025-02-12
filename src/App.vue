<template>
  <div class="min-h-screen flex flex-col" id="content-to-export">
    <!-- Top Section -->
    <div class="relative h-[70vh] bg-cover bg-center" :style="{ backgroundImage: `url(${bgImage})` }">
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
            <div class="h-48 w-full overflow-hidden border border-gray-300 rounded-md relative">
              <img :src="uploadedFile || imageFromFilename" alt="Uploaded Image" class="w-full h-full object-cover" />
              <button v-if="uploadedFile" @click="openCropper" class="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-md">Crop</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section with Recommendations -->
    <div class="p-6 bg-green-50">
      <h2 class="font-bold text-gray-800 mb-5 text-center" style="font-size: 30px;">Recommended For You</h2>
       <!-- Import and use the ExportToPDF component -->
       <ExportToPDF :recommendations="recommendations" />
      <RecommendationList :recommendations="recommendations" />
    </div>

    <!-- Image Cropper Modal -->
    <ImageCropper v-if="isCropping" :imageUrl="uploadedFile" @image-cropped="handleCroppedImage" @close="isCropping = false" />
  </div>
</template>

<script>
import axios from "axios"; 
import FileUpload from "./components/FileUpload.vue";
import RecommendationList from "./components/RecommendationList.vue";
import ExportToPDF from "./components/ExportToPDF.vue";
import ProductNameInput from "./components/ProductNameInput.vue";
import ImageCropper from "./components/ImageCropper.vue"; 
import bgImage from "@/assets/bg1.jpg";

export default {
  components: {
    FileUpload,
    RecommendationList,
    ExportToPDF,
    ProductNameInput,
  
    ImageCropper,
  },
  data() {
    return {
      backendUrl: window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "http://host.docker.internal:8000", 
      uploadedFile: null,
      imageFromFilename: null,  
      recommendations: [],
      bgImage,
      sortCriteria: 'similarity',
      isCropping: false,
    };
  },
  methods: {
    handleFileUploaded(file) {
      this.imageFromFilename = null;
      this.uploadedFile = URL.createObjectURL(file);
    },
    openCropper() {
      this.isCropping = true;
    },
    handleCroppedImage(blob) {
      this.isCropping = false;
      this.uploadedFile = URL.createObjectURL(blob); // update preview with cropped image
    },
    setRecommendations(recommendations) {
      this.recommendations = recommendations;
    },
    fetchRecommendationsByFilename(filename) {
      const uppercaseFilename = filename.toUpperCase();
      this.uploadedFile = null;
      axios
        .post(`${this.backendUrl}/recommendations/filename`, { filename: uppercaseFilename })
        .then((response) => {
          this.imageFromFilename = response.data.image_url;
          this.recommendations = response.data.recommendations;
          this.sortRecommendations();
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
