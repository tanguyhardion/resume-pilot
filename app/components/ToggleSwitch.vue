<template>
  <div class="toggle-switch-container">
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-cog-6-tooth" class="text-primary" />
          <h3 class="text-lg font-semibold">Document Options</h3>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Cover Letter Toggle -->
        <div class="space-y-2">
          <UFormField 
            label="Also Generate Cover Letter" 
            description="Toggle to generate both a resume and a cover letter"
          >
            <USwitch
              v-model="coverLetterEnabled"
              :disabled="disabled"
              color="secondary"
            />
          </UFormField>
        </div>

        <!-- Document Type Indicator -->
        <div class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <UIcon 
            :name="coverLetterEnabled ? 'i-heroicons-document-duplicate' : 'i-heroicons-document'" 
            :class="coverLetterEnabled ? 'text-secondary' : 'text-primary'"
          />
          <span class="text-sm font-medium">
            {{ coverLetterEnabled ? 'Resume + Cover Letter' : 'Resume Only' }}
          </span>
        </div>

        <!-- Master Password Input -->
        <div class="space-y-2">
          <UFormField 
            label="Master Password" 
            description="Required for authentication"
            required
          >
            <UInput
              v-model="masterPasswordValue"
              type="password"
              placeholder="Enter master password"
              :disabled="disabled"
              icon="i-heroicons-key"
            />
          </UFormField>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  masterPassword: string;
  disabled?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:masterPassword', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

const emit = defineEmits<Emits>();

const coverLetterEnabled = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

const masterPasswordValue = computed({
  get: () => props.masterPassword,
  set: (value: string) => emit('update:masterPassword', value)
});
</script>
