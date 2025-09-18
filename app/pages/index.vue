<template>
  <div class="resume-pilot-container">
    <!-- Loading Overlay -->
    <LoadingOverlay
      :show="isLoading"
      :title="
        coverLetterMode
          ? 'Generating Resume & Cover Letter...'
          : 'Generating Resume...'
      "
      message="AI is analyzing the job offer and creating your personalized document(s)"
    />

    <UContainer class="py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-4">Resume Pilot</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
          <UIcon name="i-heroicons-bolt" class="text-primary h-6 w-6" />
          AI-powered resume and cover letter generator
        </p>
      </div>

      <!-- Top Section: Document Options and Job Input -->
      <div class="space-y-6 mb-8">
        <!-- Document Options and Job Offer Input in one row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
          <!-- Document Options -->
          <div class="flex">
            <DocumentOptions
              v-model="coverLetterMode"
              v-model:master-password="masterPasswordInput"
              :disabled="isLoading"
              class="w-full"
            />
          </div>

          <!-- Job Offer Input -->
          <div class="flex">
            <JobOfferInput v-model="jobOfferText" :disabled="isLoading" class="w-full" />
          </div>
        </div>

        <!-- Generate Button -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :disabled="!canGenerate"
            :loading="isLoading"
            color="primary"
            size="xl"
            icon="i-heroicons-sparkles"
            class="flex justify-center"
            @click="handleGenerate"
          >
            Generate
            {{ coverLetterMode ? "Resume & Cover Letter" : "Resume" }}
          </UButton>

          <UButton
            v-if="zipBlob"
            variant="outline"
            size="lg"
            icon="i-heroicons-arrow-path"
            @click="handleReset"
          >
            Reset
          </UButton>
        </div>
      </div>

      <!-- Bottom Section: Preview and Download -->
      <div class="space-y-6">
        <!-- Preview -->
        <PDFPreview
          :zip-blob="zipBlob"
          :is-loading="isLoading"
          :document-type="lastGeneratedType"
        />

        <!-- Download Button(s) -->
        <div v-if="zipBlob" class="flex justify-center">
          <div
            v-if="lastGeneratedType === 'both'"
            class="flex flex-col sm:flex-row gap-4 w-full max-w-md"
          >
            <UButton
              :disabled="!resumeZipBlob || isLoading"
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
              :disabled="!coverLetterZipBlob || isLoading"
              :loading="isLoading"
              color="primary"
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
            :zip-blob="zipBlob"
            :is-loading="isLoading"
            :document-type="lastGeneratedType"
            @download="downloadZip"
          />
        </div>
      </div>

      <!-- Footer -->
      <div
        class="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
      >
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
  zipBlob,
  resumeZipBlob,
  coverLetterZipBlob,
  lastGeneratedType,
  generateResume,
  generateCoverLetter,
  generateBoth,
  downloadZip,
  reset,
} = useResumePilot();

// Local state
const jobOfferText = ref("");
const coverLetterMode = ref(false);
const masterPasswordInput = ref("");

// Computed properties
const canGenerate = computed(() => {
  return (
    jobOfferText.value.trim().length > 0 &&
    masterPasswordInput.value.trim().length > 0 &&
    !isLoading.value
  );
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
    console.error("Generation failed:", err);
  }
};

const handleReset = () => {
  reset();
  jobOfferText.value = "";
};

const downloadDocument = (type: "resume" | "coverLetter") => {
  const toast = useToast();

  if (type === "resume" && resumeZipBlob.value) {
    const url = URL.createObjectURL(resumeZipBlob.value);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.add({
      title: "Resume Downloaded",
      description: "Your resume (PDF + TeX) has been downloaded successfully.",
      color: "success",
    });
  } else if (type === "coverLetter" && coverLetterZipBlob.value) {
    const url = URL.createObjectURL(coverLetterZipBlob.value);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover_letter_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.add({
      title: "Cover Letter Downloaded",
      description: "Your cover letter (PDF + TeX) has been downloaded successfully.",
      color: "success",
    });
  }
};

// Set page meta
useHead({
  title: "Resume Pilot - AI-Powered Resume Generator",
  meta: [
    {
      name: "description",
      content:
        "Generate professional resumes and cover letters using AI technology. Simply paste a job offer and get a tailored document instantly.",
    },
  ],
});
</script>
