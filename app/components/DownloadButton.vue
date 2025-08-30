<template>
  <UButton
    :disabled="!zipBlob || isLoading"
    :loading="isLoading"
    color="primary"
    size="lg"
    icon="i-heroicons-arrow-down-tray"
    class="download-button"
    @click="handleDownload"
  >
    Download
    {{
      documentType === "resume"
        ? "Resume Archive"
        : documentType === "coverLetter"
        ? "Cover Letter Archive"
        : documentType === "both"
        ? "Cover Letter Archive"
        : "Document Archive"
    }}
  </UButton>
</template>

<script setup lang="ts">
interface Props {
  zipBlob: Blob | null;
  isLoading: boolean;
  documentType: "resume" | "coverLetter" | "both" | null;
}

interface Emits {
  (e: "download"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleDownload = () => {
  if (props.zipBlob) {
    emit("download");
  }
};
</script>
