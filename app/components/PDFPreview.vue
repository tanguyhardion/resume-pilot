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
                ? "Resume Archive"
                : documentType === "coverLetter"
                ? "Cover Letter Archive"
                : documentType === "both"
                ? "Resume + Cover Letter Archives"
                : "Document Archive"
            }}
          </UBadge>
        </div>
      </template>

      <div class="file-preview-content">
        <!-- ZIP Archive Preview -->
        <div v-if="zipBlob" class="space-y-4">
          <div
            class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[500px] flex items-center justify-center"
          >
            <div class="text-center space-y-4">
              <UIcon
                name="i-heroicons-document-check"
                class="w-16 h-16 text-primary mx-auto"
              />
              <div>
                <p class="text-lg font-medium">Archive Generated Successfully</p>
                <p class="text-sm text-gray-500">
                  {{
                    documentType === "resume"
                      ? "Resume archive (PDF + TeX)"
                      : documentType === "coverLetter"
                      ? "Cover letter archive (PDF + TeX)"
                      : documentType === "both"
                      ? "Document archives (PDF + TeX files)"
                      : "Document archive"
                  }}
                  ready for download
                </p>
              </div>
              <div class="text-xs text-gray-400">
                Size: {{ formatFileSize(zipBlob?.size || 0) }}
              </div>
              <div class="text-xs text-gray-400 mt-2">
                <UIcon name="i-heroicons-archive-box" class="w-4 h-4 inline mr-1" />
                Contains PDF and TeX source files
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
interface Props {
  zipBlob: Blob | null;
  isLoading: boolean;
  documentType: "resume" | "coverLetter" | "both" | null;
}

const props = defineProps<Props>();

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>
