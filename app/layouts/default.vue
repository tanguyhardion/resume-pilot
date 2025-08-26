<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <slot />
  </div>
</template>

<script setup>
// Enable color mode for dark theme
const colorMode = useColorMode()

// Set default to dark
if (import.meta.client && !colorMode.value) {
  colorMode.preference = 'dark'
}
</script>
