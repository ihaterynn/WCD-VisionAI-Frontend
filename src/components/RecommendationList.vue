<template>
  <div v-if="recommendations.length" class="mt-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">Top Recommendations</h2>
    <!-- Grid Layout -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="(rec, index) in recommendations"
        :key="index"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 p-4"
      >
        <a :href="rec.url" target="_blank" class="block">
          <!-- Image -->
          <img
            :src="rec.image_url"
            alt="Recommended Image"
            class="w-full h-48 object-cover rounded-md"
          />
        </a>
        <!-- Metadata -->
        <div class="mt-2 text-center">
          <p class="font-semibold text-gray-800">{{ rec.filename }}</p>
          <p class="text-sm text-gray-600">Similarity: {{ rec.similarity.toFixed(4) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["recommendations"], // Props for recommendations
};
</script>
