<template>
  <div v-if="imageUrl" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-4 z-50 backdrop-blur-sm transition-all duration-300">
    <div 
      class="bg-white p-6 rounded-xl shadow-xl max-w-[90vw] max-h-[90vh] flex flex-col transition-all duration-500 transform"
      :class="{'scale-100 opacity-100': isModalVisible, 'scale-95 opacity-0': !isModalVisible}"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Crop Your Image</h2>
        <button 
          @click="$emit('close')" 
          class="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
       
      <div class="cropper-container overflow-hidden flex justify-center items-center bg-gray-100 rounded-lg border border-gray-200 mb-4">
        <vue-cropper
          ref="cropper"
          :src="imageUrl"
          :aspect-ratio="1"
          :view-mode="1"
          :auto-crop-area="1"
          class="max-w-full max-h-[60vh]"
          :guides="true"
          :center="true"
          :highlight="true"
          :background="true"
          :cropBoxMovable="true"
          :cropBoxResizable="true"
        />
      </div>
 
      <div class="flex justify-between gap-4 mt-2">
        <button 
          @click="$emit('close')" 
          class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancel
        </button>
        <button 
          @click="cropImage" 
          class="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Apply Crop
        </button>
      </div>
    </div>
  </div>
</template>
 
<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
 
export default {
  components: { VueCropper },
  props: {
    imageUrl: String,
  },
  data() {
    return {
      isModalVisible: false
    };
  },
  mounted() {
    // Add entrance animation
    setTimeout(() => {
      this.isModalVisible = true;
    }, 50);
  },
  methods: {
    cropImage() {
      const croppedCanvas = this.$refs.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        croppedCanvas.toBlob((blob) => {
          this.$emit("image-cropped", blob);
        }, "image/jpeg");
      }
    },
  },
};
</script>
 
<style scoped>
.cropper-container {
  max-width: 90vw;
  max-height: 60vh;
  overflow: hidden;
}

/* Custom styles for cropper */
:deep(.cropper-view-box) {
  box-shadow: 0 0 0 1px #39f;
  outline: 0;
}

:deep(.cropper-point) {
  background-color: #39f;
}

:deep(.cropper-line) {
  background-color: #39f;
}
</style>