// src/services/notification-service.js
import { reactive } from 'vue';

// Create a reactive notification state object
const notificationState = reactive({
  show: false,
  type: 'info',
  message: '',
  title: '',
  duration: 3000
});

// Timers for managing notifications
let showTimer = null;
let hideTimer = null;

// Create a notification service with methods
export const notificationService = {
  // Get current state (for the component to observe)
  getState() {
    return notificationState;
  },

  // Show a notification
  notify(type, title, message, duration = 3000) {
    // Clear any pending timers
    this._clearTimers();
    
    // If a notification is already showing, hide it first
    if (notificationState.show) {
      // Hide current notification
      notificationState.show = false;
      
      // Use timeout to break the reactivity chain before showing new notification
      showTimer = setTimeout(() => {
        this._showNotification(type, title, message, duration);
      }, 300); // Wait for fade out animation
    } else {
      this._showNotification(type, title, message, duration);
    }
  },

  // Internal method to show notification
  _showNotification(type, title, message, duration) {
    // Update notification details
    notificationState.type = type || 'info';
    notificationState.title = title || '';
    notificationState.message = message || '';
    notificationState.duration = duration || 3000;
    
    // Show the notification
    notificationState.show = true;

    // Auto-hide after duration if specified
    if (duration > 0) {
      hideTimer = setTimeout(() => {
        this.hide();
      }, duration);
    }
  },

  // Hide the notification
  hide() {
    this._clearTimers();
    notificationState.show = false;
  },
  
  // Clear all notification timers
  _clearTimers() {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }
    
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }
};