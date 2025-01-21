<template>
  <div v-if="recommendations.length" class="mt-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Top Recommendations</h2>
    <ul class="space-y-4">
      <li
        v-for="(rec, index) in recommendations"
        :key="index"
        class="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
      >
        <a :href="rec.url" target="_blank" class="flex-shrink-0">
          <img
            :src="rec.image_url"
            alt="Recommended Image"
            class="w-24 h-24 rounded-lg object-cover"
          />
        </a>
        <div class="ml-4">
          <p class="font-semibold text-gray-800">{{ rec.filename }}</p>
          <p class="text-sm text-gray-600">Similarity: {{ rec.similarity.toFixed(4) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["recommendations"], 
};
</script>

