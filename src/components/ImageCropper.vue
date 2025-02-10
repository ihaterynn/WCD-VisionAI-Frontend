<template>
    <div v-if="imageUrl" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white p-4 rounded-lg shadow-lg max-w-[90vw] max-h-[90vh] flex flex-col">
        <h2 class="text-xl font-semibold mb-4 text-center">Crop Your Image</h2>
        
        <!-- Make the container responsive -->
        <div class="cropper-container overflow-hidden flex justify-center items-center">
          <vue-cropper
            ref="cropper"
            :src="imageUrl"
            :aspect-ratio="1"
            :view-mode="1"
            :auto-crop-area="1"
            class="max-w-full max-h-[70vh]"
          />
        </div>
  
        <div class="flex justify-between mt-4">
          <button @click="cropImage" class="bg-green-500 text-white px-4 py-2 rounded-lg">Crop</button>
          <button @click="$emit('close')" class="bg-red-500 text-white px-4 py-2 rounded-lg">Cancel</button>
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
    max-height: 70vh; 
    overflow: hidden;
  }
  </style>
  