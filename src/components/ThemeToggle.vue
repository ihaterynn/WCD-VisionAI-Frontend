<template>
    <button 
      @click="toggleTheme"
      class="fixed top-4 right-4 z-40 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
      :class="{ 'rotate-180': isDarkMode }"
    >
      <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isDarkMode: false
      }
    },
    mounted() {
      // Check for saved theme preference or system preference
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      this.isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
      
      // Apply theme on initial load
      this.applyTheme();
      
      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.isDarkMode = e.matches;
          this.applyTheme();
        }
      });
    },
    methods: {
      toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
      },
      applyTheme() {
        if (this.isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  }
  </script>
  
  <style scoped>
  button {
    transform-origin: center;
    transition: transform 0.5s ease;
  }
  </style>