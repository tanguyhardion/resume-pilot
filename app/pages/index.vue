<template>
  <div class="resume-pilot-container">
    <!-- Loading Overlay -->
    <LoadingOverlay
      :show="isLoading"
      :title="coverLetterMode ? 'Generating Resume & Cover Letter...' : 'Generating Resume...'"
      message="AI is analyzing the job offer and creating your personalized document(s)"
    />

    <UContainer class="py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-4">Resume Pilot</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          AI-powered resume and cover letter generator
        </p>
      </div>

      <!-- Error Alert -->
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        class="mb-6"
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link', padded: false }"
        @close="clearError"
      >
        <template #title>Generation Error</template>
        <template #description>{{ error }}</template>
      </UAlert>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column: Input and Options -->
        <div class="space-y-6">
          <!-- Document Options -->
          <ToggleSwitch
            v-model="coverLetterMode"
            v-model:master-password="masterPasswordInput"
            :disabled="isLoading"
          />

          <!-- Job Offer Input -->
          <JobOfferInput
            v-model="jobOfferText"
            :disabled="isLoading"
          />

          <!-- Generate Button -->
          <div class="flex flex-col sm:flex-row gap-4">
            <UButton
              :disabled="!canGenerate"
              :loading="isLoading"
              color="primary"
              size="lg"
              icon="i-heroicons-sparkles"
              class="flex-1"
              @click="handleGenerate"
            >
              Generate {{ coverLetterMode ? 'Resume & Cover Letter' : 'Resume' }}
            </UButton>

            <UButton
              v-if="pdfBlob"
              variant="outline"
              size="lg"
              icon="i-heroicons-arrow-path"
              @click="handleReset"
            >
              Reset
            </UButton>
          </div>
        </div>

        <!-- Right Column: Preview and Download -->
        <div class="space-y-6">
          <!-- PDF Preview -->
          <PDFPreview
            :pdf-blob="pdfBlob"
            :is-loading="isLoading"
            :document-type="lastGeneratedType"
          />

          <!-- Download Button(s) -->
          <div v-if="pdfBlob" class="flex justify-center">
            <div v-if="lastGeneratedType === 'both'" class="flex flex-col sm:flex-row gap-4 w-full">
              <UButton
                :disabled="!resumeBlob || isLoading"
                :loading="isLoading"
                color="primary"
                size="lg"
                icon="i-heroicons-arrow-down-tray"
                class="flex-1"
                @click="downloadDocument('resume')"
              >
                Download Resume
              </UButton>
              <UButton
                :disabled="!coverLetterBlob || isLoading"
                :loading="isLoading"
                color="warning"
                size="lg"
                icon="i-heroicons-arrow-down-tray"
                class="flex-1"
                @click="downloadDocument('coverLetter')"
              >
                Download Cover Letter
              </UButton>
            </div>
            <DownloadButton
              v-else
              :pdf-blob="pdfBlob"
              :is-loading="isLoading"
              :document-type="lastGeneratedType"
              @download="downloadPdf"
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500">
          Powered by AI • Generate professional documents instantly
        </p>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Use the composable
const {
  isLoading,
  error,
  pdfBlob,
  resumeBlob,
  coverLetterBlob,
  lastGeneratedType,
  generateResume,
  generateCoverLetter,
  generateBoth,
  downloadPdf,
  clearError,
  reset
} = useResumePilot();

// Local state
const jobOfferText = ref('');
const coverLetterMode = ref(false);
const masterPasswordInput = ref('');

// Computed properties
const canGenerate = computed(() => {
  return jobOfferText.value.trim().length > 0 && 
         masterPasswordInput.value.trim().length > 0 && 
         !isLoading.value;
});

// Methods
const handleGenerate = async () => {
  if (!canGenerate.value) return;

  try {
    if (coverLetterMode.value) {
      await generateBoth(jobOfferText.value, masterPasswordInput.value);
    } else {
      await generateResume(jobOfferText.value, masterPasswordInput.value);
    }
  } catch (err) {
    console.error('Generation failed:', err);
  }
};

const handleReset = () => {
  reset();
  jobOfferText.value = '';
};

const downloadDocument = (type: 'resume' | 'coverLetter') => {
  if (type === 'resume' && resumeBlob.value) {
    const url = URL.createObjectURL(resumeBlob.value);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else if (type === 'coverLetter' && coverLetterBlob.value) {
    const url = URL.createObjectURL(coverLetterBlob.value);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover_letter_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

// Set page meta
useHead({
  title: 'Resume Pilot - AI-Powered Resume Generator',
  meta: [
    {
      name: 'description',
      content: 'Generate professional resumes and cover letters using AI technology. Simply paste a job offer and get a tailored document instantly.'
    }
  ]
});
</script>
