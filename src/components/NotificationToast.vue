<template>
  <transition name="toast">
    <div
      v-if="state.show"
      :class="[
        'fixed z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 flex items-center',
        position,
        typeClasses[state.type]
      ]"
    >
      <!-- Icon based on type -->
      <div class="mr-3">
        <svg v-if="state.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else-if="state.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="state.type === 'info'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
     
      <!-- Content -->
      <div>
        <div v-if="state.title" class="font-medium">{{ state.title }}</div>
        <div class="text-sm">{{ state.message }}</div>
      </div>
     
      <!-- Close button -->
      <button
        @click="hideNotification"
        class="ml-auto -mr-1 text-current opacity-70 hover:opacity-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </transition>
</template>

<script>
import { notificationService } from '../services/notification-service';

export default {
  name: 'NotificationToast',
  props: {
    position: {
      type: String,
      default: 'bottom-4 right-4'
    }
  },
  data() {
    return {
      // Get state from notification service
      state: notificationService.getState(),
      typeClasses: {
        success: 'bg-green-100 text-green-800 border-l-4 border-green-500',
        error: 'bg-red-100 text-red-800 border-l-4 border-red-500',
        info: 'bg-blue-100 text-blue-800 border-l-4 border-blue-500',
        warning: 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500'
      }
    };
  },
  methods: {
    hideNotification() {
      notificationService.hide();
    }
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>