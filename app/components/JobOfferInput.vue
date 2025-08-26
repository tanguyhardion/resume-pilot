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
        <UFormField label="Paste Job Offer" description="Paste the job offer text here">
          <UTextarea
            v-model="jobOfferText"
            placeholder="Paste the job offer description here..."
            :rows="12"
            class="job-offer-input"
            :disabled="disabled"
          />
        </UFormField>

        <!-- File Upload Option -->
        <div class="border-t pt-4">
          <UFormField label="Or Upload File" description="Upload a text file containing the job offer">
            <UInput
              type="file"
              accept=".txt,.doc,.docx,.pdf"
              @change="handleFileUpload"
              :disabled="disabled"
            />
          </UFormField>
        </div>

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
  (e: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

const emit = defineEmits<Emits>();

const jobOfferText = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
});

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  try {
    const text = await file.text();
    jobOfferText.value = text;
  } catch (error) {
    console.error('Error reading file:', error);
    // You could emit an error event here if needed
  }
};
</script>


