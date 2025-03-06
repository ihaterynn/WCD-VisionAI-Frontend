<template>
  <transition name="fade">
    <div v-if="computedShow" class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm">
      <div class="text-center">
        <div class="loading">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <p class="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LoadingScreen',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Loading...'
    }
  },
  data() {
    return {
      // Local show state to avoid reactivity issues
      localShow: false,
      // Timer for delayed visibility to prevent flicker for fast operations
      showTimer: null,
      hideTimer: null
    };
  },
  computed: {
    // Computed property with debouncing built in
    computedShow() {
      return this.localShow;
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.showLoading();
      } else {
        this.hideLoading();
      }
    }
  },
  methods: {
    showLoading() {
      // Clear any pending hide timer
      clearTimeout(this.hideTimer);
      
      // Small delay before showing loading to prevent flicker for super-fast operations
      this.showTimer = setTimeout(() => {
        this.localShow = true;
      }, 50);
    },
    hideLoading() {
      // Clear any pending show timer
      clearTimeout(this.showTimer);
      
      // Small delay before hiding to ensure visibility for very fast operations
      this.hideTimer = setTimeout(() => {
        this.localShow = false;
      }, 100);
    }
  },
  mounted() {
    // Initial state sync
    if (this.show) {
      this.showLoading();
    }
  },
  beforeUnmount() {
    // Clean up timers
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);
  }
}
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: inline-block;
  background: linear-gradient(to right, #3b82f6, #10b981);
  animation: scaling 1.5s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: 0.2s;
}

.dot:nth-child(2) {
  animation-delay: 0.4s;
}

.dot:nth-child(3) {
  animation-delay: 0.6s;
}

.dot:nth-child(4) {
  animation-delay: 0.8s;
}

@keyframes scaling {
  0%, 100% {
    transform: scale(0.2);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>