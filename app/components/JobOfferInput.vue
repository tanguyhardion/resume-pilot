<template>
  <div class="job-offer-input-container h-full">
    <UCard class="mb-6 h-full flex flex-col">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-document-text" class="text-primary text-2xl" />
          <h3 class="text-lg font-semibold">Job Offer Input</h3>
        </div>
      </template>

      <div class="space-y-4 flex-1 flex flex-col">
        <!-- Text Area Input -->
        <UFormField
          label="Paste Job Offer"
          description="Paste the job offer text below "
          class="flex-1 flex flex-col"
        >
          <UTextarea
            v-model="jobOfferText"
            placeholder="Paste the job offer description here..."
            :rows="8"
            class="job-offer-input flex-1"
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
