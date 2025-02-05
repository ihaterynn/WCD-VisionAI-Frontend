<template>
  <div v-if="recommendations.length" class="mt-6">
    <!-- Grid Layout -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="(rec, index) in recommendations"
        :key="rec.filename" 
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 p-4"
      >
        <a :href="rec.url" target="_blank" class="block">
          <img
            :src="rec.image_url"
            alt="Recommended Image"
            class="w-full h-full object-cover rounded-md"
          />
        </a>

        <!-- Metadata -->
        <div class="mt-2 text-center">
          <p class="font-semibold text-gray-800">{{ rec.filename }}</p>
          <p class="text-sm text-gray-600 mb-2">Similarity: {{ rec.similarity.toFixed(4) }}%</p>
          
          <!-- Display inventory count -->
          <p v-if="rec.inventory_count !== undefined" class="text-sm text-gray-600">
            Inventory: {{ rec.inventory_count }}
          </p>

          <p v-if="rec.url" class="mt-2">
            <a :href="rec.url" target="_blank" class="text-blue-600">Click To View Product</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    recommendations: {
      type: Array,
      default: () => [],  
    },
  },
};
</script>
