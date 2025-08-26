import { ref, readonly } from 'vue';

export interface PersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
}

export interface ResumeRequest {
  jobOffer: string;
  masterPassword: string;
  personalInfo?: PersonalInfo;
}

export interface CoverLetterRequest {
  jobOffer: string;
  masterPassword: string;
  personalInfo?: PersonalInfo;
}

export const useResumePilot = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const pdfBlob = ref<Blob | null>(null);
  const resumeBlob = ref<Blob | null>(null);
  const coverLetterBlob = ref<Blob | null>(null);
  const lastGeneratedType = ref<'resume' | 'coverLetter' | 'both' | null>(null);

  // Backend configuration
  const backendUrl = ref('http://localhost:3001');

  const generateResume = async (jobOffer: string, masterPassword?: string, personalInfo?: PersonalInfo) => {
    isLoading.value = true;
    error.value = null;
    pdfBlob.value = null;

    try {
      const payload: ResumeRequest = {
        jobOffer,
        masterPassword: masterPassword || '',
        personalInfo
      };

      const response = await fetch(`${backendUrl.value}/api/generateResume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      pdfBlob.value = blob;
      resumeBlob.value = blob;
      lastGeneratedType.value = 'resume';

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred while generating the resume';
      console.error('Resume generation error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const generateCoverLetter = async (jobOffer: string, masterPassword?: string, personalInfo?: PersonalInfo) => {
    isLoading.value = true;
    error.value = null;
    pdfBlob.value = null;

    try {
      const payload: CoverLetterRequest = {
        jobOffer,
        masterPassword: masterPassword || '',
        personalInfo
      };

      const response = await fetch(`${backendUrl.value}/api/generateCoverLetter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      pdfBlob.value = blob;
      coverLetterBlob.value = blob;
      lastGeneratedType.value = 'coverLetter';

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred while generating the cover letter';
      console.error('Cover letter generation error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const generateBoth = async (jobOffer: string, masterPassword?: string, personalInfo?: PersonalInfo) => {
    isLoading.value = true;
    error.value = null;
    pdfBlob.value = null;
    resumeBlob.value = null;
    coverLetterBlob.value = null;

    try {
      const payload = {
        jobOffer,
        masterPassword: masterPassword || '',
        personalInfo
      };

      // Generate both resume and cover letter in parallel
      const [resumeResponse, coverLetterResponse] = await Promise.all([
        fetch(`${backendUrl.value}/api/generateResume`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }),
        fetch(`${backendUrl.value}/api/generateCoverLetter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      ]);

      if (!resumeResponse.ok) {
        const errorData = await resumeResponse.json();
        throw new Error(errorData.error || `Resume generation failed: ${resumeResponse.status}`);
      }

      if (!coverLetterResponse.ok) {
        const errorData = await coverLetterResponse.json();
        throw new Error(errorData.error || `Cover letter generation failed: ${coverLetterResponse.status}`);
      }

      const [resumeBlobData, coverLetterBlobData] = await Promise.all([
        resumeResponse.blob(),
        coverLetterResponse.blob()
      ]);

      resumeBlob.value = resumeBlobData;
      coverLetterBlob.value = coverLetterBlobData;
      // Show cover letter by default when both are generated
      pdfBlob.value = coverLetterBlobData;
      lastGeneratedType.value = 'both';

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred while generating documents';
      console.error('Document generation error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const downloadPdf = () => {
    if (!pdfBlob.value) return;

    const url = URL.createObjectURL(pdfBlob.value);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lastGeneratedType.value || 'document'}_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearError = () => {
    error.value = null;
  };

  const reset = () => {
    isLoading.value = false;
    error.value = null;
    pdfBlob.value = null;
    resumeBlob.value = null;
    coverLetterBlob.value = null;
    lastGeneratedType.value = null;
  };

  return {
    // State
    isLoading: readonly(isLoading),
    error: readonly(error),
    pdfBlob: readonly(pdfBlob),
    resumeBlob: readonly(resumeBlob),
    coverLetterBlob: readonly(coverLetterBlob),
    lastGeneratedType: readonly(lastGeneratedType),
    
    // Configuration
    backendUrl,
    
    // Actions
    generateResume,
    generateCoverLetter,
    generateBoth,
    downloadPdf,
    clearError,
    reset
  };
};
