<template>
  <div class="file-preview-container">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-document-magnifying-glass"
              class="text-primary text-2xl"
            />
            <h3 class="text-lg font-semibold">Preview</h3>
          </div>
          <UBadge
            v-if="documentType"
            :color="
              documentType === 'resume'
                ? 'success'
                : documentType === 'both'
                ? 'secondary'
                : 'warning'
            "
          >
            {{
              documentType === "resume"
                ? "Resume"
                : documentType === "coverLetter"
                ? "Cover Letter"
                : documentType === "both"
                ? "Resume + Cover Letter"
                : "Document"
            }}
          </UBadge>
        </div>
      </template>

      <div class="file-preview-content">
        <!-- PDF Preview with Tabs -->
        <div v-if="zipBlob" class="space-y-4">
          <!-- Tab Navigation (only show if both documents exist) -->
          <div v-if="documentType === 'both'" class="flex justify-center">
            <div class="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                @click="activeTab = 'resume'"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === 'resume'
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-2 inline" />
                Resume
              </button>
              <button
                @click="activeTab = 'coverLetter'"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === 'coverLetter'
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                <UIcon name="i-heroicons-envelope" class="w-4 h-4 mr-2 inline" />
                Cover Letter
              </button>
            </div>
          </div>

          <!-- PDF Preview Frame -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[600px]">
            <div v-if="currentPdfUrl" class="w-full h-full">
              <iframe
                :src="currentPdfUrl"
                class="w-full h-[580px] border-0 rounded"
                type="application/pdf"
              />
            </div>
            <div v-else class="flex items-center justify-center h-[580px]">
              <div class="text-center space-y-4">
                <UIcon
                  name="i-heroicons-arrow-path"
                  class="w-12 h-12 text-gray-400 mx-auto animate-spin"
                />
                <p class="text-gray-600 dark:text-gray-300">
                  Loading PDF preview...
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- No Preview State -->
        <div
          v-else-if="!isLoading"
          class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center min-h-[500px] flex items-center justify-center"
        >
          <div class="space-y-4">
            <UIcon
              name="i-heroicons-document-duplicate"
              class="w-16 h-16 text-gray-400 mx-auto"
            />
            <div>
              <p class="text-lg font-medium text-gray-600 dark:text-gray-300">
                No Archive Generated
              </p>
              <p class="text-sm text-gray-500">
                Enter a job offer and click generate to see your document archive here
              </p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div
          v-else
          class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center min-h-[500px] flex items-center justify-center"
        >
          <div class="space-y-4">
            <div class="loading-spinner">
              <UIcon
                name="i-heroicons-arrow-path"
                class="w-16 h-16 animate-spin mx-auto"
              />
            </div>
            <div>
              <p class="text-lg font-medium">
                Generating {{ documentType || "Document" }} Archive...
              </p>
              <p class="text-sm text-gray-500">
                Please wait while we create your personalized documents (PDF + TeX)
              </p>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import JSZip from 'jszip';

interface Props {
  zipBlob: Blob | null;
  isLoading: boolean;
  documentType: "resume" | "coverLetter" | "both" | null;
}

const props = defineProps<Props>();

// Reactive state
const activeTab = ref<'resume' | 'coverLetter'>('resume');
const resumePdfUrl = ref<string | null>(null);
const coverLetterPdfUrl = ref<string | null>(null);

// Computed property for current PDF URL based on active tab
const currentPdfUrl = computed(() => {
  if (props.documentType === 'resume') {
    return resumePdfUrl.value;
  } else if (props.documentType === 'coverLetter') {
    return coverLetterPdfUrl.value;
  } else if (props.documentType === 'both') {
    return activeTab.value === 'resume' ? resumePdfUrl.value : coverLetterPdfUrl.value;
  }
  return null;
});

// Extract PDFs from ZIP when zipBlob changes
watch(() => props.zipBlob, async (newZipBlob) => {
  // Clean up previous URLs
  if (resumePdfUrl.value) {
    URL.revokeObjectURL(resumePdfUrl.value);
    resumePdfUrl.value = null;
  }
  if (coverLetterPdfUrl.value) {
    URL.revokeObjectURL(coverLetterPdfUrl.value);
    coverLetterPdfUrl.value = null;
  }

  if (!newZipBlob) return;

  try {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(newZipBlob);
    
    // Extract PDFs from ZIP
    const files = Object.keys(zipContent.files);
    
    for (const filename of files) {
      const file = zipContent.files[filename];
      
      if (file && filename.endsWith('.pdf') && !file.dir) {
        const pdfBlob = await file.async('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        if (filename.toLowerCase().includes('resume')) {
          resumePdfUrl.value = pdfUrl;
        } else if (filename.toLowerCase().includes('cover')) {
          coverLetterPdfUrl.value = pdfUrl;
        }
      }
    }
  } catch (error) {
    console.error('Error extracting PDFs from ZIP:', error);
  }
}, { immediate: true });

// Set initial active tab based on document type
watch(() => props.documentType, (newType) => {
  if (newType === 'coverLetter') {
    activeTab.value = 'coverLetter';
  } else {
    activeTab.value = 'resume';
  }
}, { immediate: true });

// Cleanup URLs on unmount
onUnmounted(() => {
  if (resumePdfUrl.value) {
    URL.revokeObjectURL(resumePdfUrl.value);
  }
  if (coverLetterPdfUrl.value) {
    URL.revokeObjectURL(coverLetterPdfUrl.value);
  }
});

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>
