<template>
  <div class="animated-background fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
    <!-- gradient background -->
    <div class="absolute inset-0 
      bg-gradient-to-br 
      from-blue-300/50 dark:from-blue-900/30 
      via-white/20 dark:via-gray-900/40 
      to-green-200/50 dark:to-green-900/30 
      animate-gradient"
    ></div>
     
    <!-- floating particles -->
    <div
      v-for="(particle, index) in particles"
      :key="index"
      :class="particle.class"
      :style="particle.style"
      class="absolute transform transition-all duration-300 ease-in-out"
    ></div>
     
    <!-- Subtle grid overlay -->
    <div class="absolute inset-0 bg-grid opacity-5 dark:opacity-10"></div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      particles: [],
      isDarkMode: false
    }
  },
  mounted() {
    // Detect initial dark mode
    this.isDarkMode = document.documentElement.classList.contains('dark');
    this.generateParticles();

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.isDarkMode = document.documentElement.classList.contains('dark');
          this.generateParticles();
        }
      });
    });
    
    observer.observe(document.documentElement, { 
      attributes: true,
      attributeFilter: ['class']
    });
  },
  methods: {
    generateParticles() {
      const particleCount = 25;
      const particles = [];
     
      for (let i = 0; i < particleCount; i++) {
        const size = this.getRandomNumber(6, 16); 
        const opacity = this.getRandomNumber(3, 6) / 10; 
        const delay = this.getRandomNumber(0, 7);
        const duration = this.getRandomNumber(20, 35);
        const left = this.getRandomNumber(0, 100);
        const top = this.getRandomNumber(0, 100);
        const isSquare = Math.random() > 0.9; 
         
        particles.push({
          class: `particle ${isSquare ? 'square' : 'circle'}
                  ${this.isDarkMode 
                    ? 'bg-opacity-20 dark:bg-opacity-40 border-opacity-5 dark:border-opacity-20' 
                    : 'bg-opacity-30 border-opacity-10'
                  }
                  shadow-sm
                  border`,
          style: {
            width: `${size}px`,
            height: `${size}px`,
            opacity: this.isDarkMode ? Math.max(opacity, 0.4) : opacity,
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            backgroundColor: this.getRandomColor(),
            boxShadow: '0 2px 3px rgba(0,0,0,0.05)' 
          }
        });
      }
     
      this.particles = particles;
    },
    getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomColor() {
      const lightModeColors = [
        'rgba(59, 130, 246, 0.4)',   // blue-500
        'rgba(16, 185, 129, 0.4)',   // green-500
        'rgba(245, 158, 11, 0.4)',   // amber-500
        'rgba(99, 102, 241, 0.4)',   // indigo-500
        'rgba(236, 72, 153, 0.4)'    // pink-500
      ];

      const darkModeColors = [
        'rgba(59, 130, 246, 0.5)',   // blue-500
        'rgba(16, 185, 129, 0.5)',   // green-500
        'rgba(245, 158, 11, 0.5)',   // amber-500
        'rgba(99, 102, 241, 0.5)',   // indigo-500
        'rgba(236, 72, 153, 0.5)'    // pink-500
      ];

      return this.isDarkMode 
        ? darkModeColors[Math.floor(Math.random() * darkModeColors.length)]
        : lightModeColors[Math.floor(Math.random() * lightModeColors.length)];
    }
  }
}
</script>
 
<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-60px) rotate(180deg);
    opacity: 0.5;
  }
}
 
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
 
.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}
 
.bg-grid {
  background-image: linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                    linear-gradient(to bottom, #f0f0f0 1px, transparent 1px);
  background-size: 20px 20px;
}

.dark .bg-grid {
  background-image: linear-gradient(to right, #333 1px, transparent 1px),
                    linear-gradient(to bottom, #333 1px, transparent 1px);
}
 
.particle {
  position: absolute;
  will-change: transform;
  animation: float linear infinite;
  transition: all 0.3s ease;
  border-radius: 3px;
}
 
.circle {
  border-radius: 50%;
}
 
.square {
  transform: rotate(45deg);
}
</style>