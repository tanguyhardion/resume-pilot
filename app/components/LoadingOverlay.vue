<template>
  <div class="loading-overlay" :class="{ active: show }">
    <div class="loading-content">
      <div class="loading-spinner-container">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-12 h-12 animate-spin text-primary"
        />
      </div>
      <div class="loading-text">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <p class="text-sm text-gray-500">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  title?: string;
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Processing...",
  message: "Please wait while we process your request.",
});
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.loading-overlay.active {
  opacity: 1;
  visibility: visible;
}

.loading-content {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  min-width: 300px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.dark .loading-content {
  background: #1f2937;
}

.loading-spinner-container {
  margin-bottom: 1rem;
}

.loading-text h3 {
  margin-bottom: 0.5rem;
}
</style>
