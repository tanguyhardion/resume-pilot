<template>
  <div class="pdf-preview-container">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-document" class="text-primary" />
            <h3 class="text-lg font-semibold">Preview</h3>
          </div>
          <UBadge v-if="documentType" :color="documentType === 'resume' ? 'success' : documentType === 'both' ? 'secondary' : 'warning'">
            {{ 
              documentType === 'resume' ? 'Resume' : 
              documentType === 'coverLetter' ? 'Cover Letter' : 
              documentType === 'both' ? 'Resume + Cover Letter' : 
              'Document' 
            }}
          </UBadge>
        </div>
      </template>

      <div class="pdf-preview-content">
        <!-- PDF Preview -->
        <div v-if="pdfBlob" class="space-y-4">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[500px] flex items-center justify-center">
            <div class="text-center space-y-4">
              <UIcon name="i-heroicons-document-check" class="w-16 h-16 text-primary mx-auto" />
              <div>
                <p class="text-lg font-medium">PDF Generated Successfully</p>
                <p class="text-sm text-gray-500">
                  {{ 
                    documentType === 'resume' ? 'Resume' : 
                    documentType === 'coverLetter' ? 'Cover Letter' : 
                    documentType === 'both' ? 'Documents are' : 
                    'Document is' 
                  }} ready for download
                </p>
              </div>
              <div class="text-xs text-gray-400">
                Size: {{ formatFileSize(pdfBlob.size) }}
              </div>
            </div>
          </div>
        </div>

        <!-- No Preview State -->
        <div v-else-if="!isLoading" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center min-h-[500px] flex items-center justify-center">
          <div class="space-y-4">
            <UIcon name="i-heroicons-document-duplicate" class="w-16 h-16 text-gray-400 mx-auto" />
            <div>
              <p class="text-lg font-medium text-gray-600 dark:text-gray-300">No Document Generated</p>
              <p class="text-sm text-gray-500">
                Enter a job offer and click generate to see your document here
              </p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center min-h-[500px] flex items-center justify-center">
          <div class="space-y-4">
            <div class="loading-spinner">
              <UIcon name="i-heroicons-arrow-path" class="w-16 h-16 animate-spin mx-auto" />
            </div>
            <div>
              <p class="text-lg font-medium">Generating {{ documentType || 'Document' }}...</p>
              <p class="text-sm text-gray-500">
                Please wait while we create your personalized document
              </p>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface Props {
  pdfBlob: Blob | null;
  isLoading: boolean;
  documentType: 'resume' | 'coverLetter' | 'both' | null;
}

const props = defineProps<Props>();

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>
