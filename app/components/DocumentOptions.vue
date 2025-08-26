<template>
  <div class="toggle-switch-container h-full">
    <UCard class="mb-6 h-full flex flex-col">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-cog-6-tooth" class="text-primary text-2xl" />
          <h3 class="text-lg font-semibold">Document Options</h3>
        </div>
      </template>

      <div class="space-y-4 flex-1 flex flex-col justify-between">
        <!-- Cover Letter Toggle -->
        <div class="space-y-2">
          <UFormField
            label="Generate Cover Letter"
            description="Toggle to generate both a resume and a cover letter"
            :ui="{ description: 'mb-4 mt-1' }"
          >
            <USwitch
              v-model="coverLetterEnabled"
              :disabled="disabled"
              color="secondary"
              size="lg"
            />
          </UFormField>
        </div>

        <!-- Document Type Indicator -->
        <div
          class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6"
        >
          <UIcon
            :name="
              coverLetterEnabled
                ? 'i-heroicons-document-duplicate'
                : 'i-heroicons-document'
            "
            :class="[
              'text-lg',
              coverLetterEnabled ? 'text-secondary' : 'text-primary',
            ]"
          />
          <span class="text-sm font-medium">
            {{ coverLetterEnabled ? "Resume + Cover Letter" : "Resume Only" }}
          </span>
        </div>

        <!-- Master Password Input -->
        <div class="space-y-2">
          <UFormField
            label="Master Password"
            description="Required for authentication"
            required
            :ui="{ description: 'mb-4 mt-1' }"
          >
            <UInput
              v-model="masterPasswordValue"
              type="password"
              placeholder="Enter master password"
              :disabled="disabled"
              icon="i-heroicons-key"
              :ui="{ base: 'px-4 py-3' }"
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
  (e: "update:modelValue", value: boolean): void;
  (e: "update:masterPassword", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<Emits>();

// Load master password from session storage on mount
onMounted(() => {
  if (import.meta.client) {
    const storedPassword = sessionStorage.getItem("masterPassword");
    if (storedPassword && !props.masterPassword) {
      emit("update:masterPassword", storedPassword);
    }
  }
});

const coverLetterEnabled = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const masterPasswordValue = computed({
  get: () => props.masterPassword,
  set: (value: string) => {
    // Store in session storage
    if (import.meta.client) {
      sessionStorage.setItem("masterPassword", value);
    }
    emit("update:masterPassword", value);
  },
});
</script>
