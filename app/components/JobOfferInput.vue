<template>
  <div class="job-offer-input-container">
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-document-text" class="text-primary" />
          <h3 class="text-lg font-semibold">Job Offer Input</h3>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Text Area Input -->
        <UFormField
          label="Paste Job Offer"
          description="Paste the job offer text below "
        >
          <UTextarea
            v-model="jobOfferText"
            placeholder="Paste the job offer description here..."
            :rows="12"
            class="job-offer-input"
            :disabled="disabled"
            autoresize
          />
        </UFormField>

        <!-- Character Count -->
        <div class="text-sm text-gray-500 text-right">
          {{ jobOfferText.length }} characters
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  disabled?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<Emits>();

const jobOfferText = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});
</script>

<style lang="scss" scoped>
.job-offer-input {
  width: 100%;
  margin: 16px 0;
}
</style>
