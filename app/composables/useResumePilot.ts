import { ref, readonly } from 'vue';

export const useResumePilot = () => {
  const toast = useToast();
  
  const isLoading = ref(false);
  const pdfBlob = ref<Blob | null>(null);
  const resumeBlob = ref<Blob | null>(null);
  const coverLetterBlob = ref<Blob | null>(null);
  const lastGeneratedType = ref<'resume' | 'coverLetter' | 'both' | null>(null);

  // Backend configuration
  const backendUrl = ref('http://localhost:3001');

  const generateResume = async (jobOffer: string, masterPassword?: string, personalInfo?: PersonalInfo) => {
    isLoading.value = true;
    pdfBlob.value = null;

    try {
      resumeApiService.setBackendUrl(backendUrl.value);
      const blob = await resumeApiService.generateResume(jobOffer, masterPassword, personalInfo);
      
      pdfBlob.value = blob;
      resumeBlob.value = blob;
      lastGeneratedType.value = 'resume';

      toast.add({
        title: 'Resume Generated Successfully',
        description: 'Your resume has been generated and is ready for download.',
        color: 'success'
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while generating the resume';
      console.error('Resume generation error:', err);
      
      toast.add({
        title: 'Generation Error',
        description: errorMessage,
        color: 'error'
      });
    } finally {
      isLoading.value = false;
    }
  };

  const generateCoverLetter = async (jobOffer: string, masterPassword?: string, personalInfo?: PersonalInfo) => {
    isLoading.value = true;
    pdfBlob.value = null;

    try {
      resumeApiService.setBackendUrl(backendUrl.value);
      const blob = await resumeApiService.generateCoverLetter(jobOffer, masterPassword, personalInfo);
      
      pdfBlob.value = blob;
      coverLetterBlob.value = blob;
      lastGeneratedType.value = 'coverLetter';

      toast.add({
        title: 'Cover Letter Generated Successfully',
        description: 'Your cover letter has been generated and is ready for download.',
        color: 'success'
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while generating the cover letter';
      console.error('Cover letter generation error:', err);
      
      toast.add({
        title: 'Generation Error',
        description: errorMessage,
        color: 'error'
      });
    } finally {
      isLoading.value = false;
    }
  };

  const generateBoth = async (jobOffer: string, masterPassword?: string, personalInfo?: PersonalInfo) => {
    isLoading.value = true;
    pdfBlob.value = null;
    resumeBlob.value = null;
    coverLetterBlob.value = null;

    try {
      resumeApiService.setBackendUrl(backendUrl.value);
      const { resume, coverLetter } = await resumeApiService.generateBoth(jobOffer, masterPassword, personalInfo);

      resumeBlob.value = resume;
      coverLetterBlob.value = coverLetter;
      // Show cover letter by default when both are generated
      pdfBlob.value = coverLetter;
      lastGeneratedType.value = 'both';

      toast.add({
        title: 'Documents Generated Successfully',
        description: 'Your resume and cover letter have been generated and are ready for download.',
        color: 'success'
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while generating documents';
      console.error('Document generation error:', err);
      
      toast.add({
        title: 'Generation Error',
        description: errorMessage,
        color: 'error'
      });
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
    
    toast.add({
      title: 'Document Downloaded',
      description: `Your ${lastGeneratedType.value || 'document'} has been downloaded successfully.`,
      color: 'success'
    });
  };

  const reset = () => {
    isLoading.value = false;
    pdfBlob.value = null;
    resumeBlob.value = null;
    coverLetterBlob.value = null;
    lastGeneratedType.value = null;
  };

  return {
    // State
    isLoading: readonly(isLoading),
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
    reset
  };
};
