import { ref, readonly } from 'vue';

export const useResumePilot = () => {
  const toast = useToast();
  
  const isLoading = ref(false);
  const zipBlob = ref<Blob | null>(null); // Now stores ZIP file instead of PDF
  const resumeZipBlob = ref<Blob | null>(null);
  const coverLetterZipBlob = ref<Blob | null>(null);
  const lastGeneratedType = ref<'resume' | 'coverLetter' | 'both' | null>(null);

  // Backend configuration
  const backendUrl = ref('http://localhost:3001');

  const generateResume = async (jobOffer: string, masterPassword?: string, personalInfo?: PersonalInfo) => {
    isLoading.value = true;
    zipBlob.value = null;

    try {
      resumeApiService.setBackendUrl(backendUrl.value);
      const blob = await resumeApiService.generateResume(jobOffer, masterPassword, personalInfo);
      
      zipBlob.value = blob;
      resumeZipBlob.value = blob;
      lastGeneratedType.value = 'resume';

      toast.add({
        title: 'Resume Generated Successfully',
        description: 'Your resume has been generated and is ready for download (includes PDF and TeX files).',
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
    zipBlob.value = null;

    try {
      resumeApiService.setBackendUrl(backendUrl.value);
      const blob = await resumeApiService.generateCoverLetter(jobOffer, masterPassword, personalInfo);
      
      zipBlob.value = blob;
      coverLetterZipBlob.value = blob;
      lastGeneratedType.value = 'coverLetter';

      toast.add({
        title: 'Cover Letter Generated Successfully',
        description: 'Your cover letter has been generated and is ready for download (includes PDF and TeX files).',
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
    zipBlob.value = null;
    resumeZipBlob.value = null;
    coverLetterZipBlob.value = null;

    try {
      resumeApiService.setBackendUrl(backendUrl.value);
      const { resume, coverLetter } = await resumeApiService.generateBoth(jobOffer, masterPassword, personalInfo);

      resumeZipBlob.value = resume;
      coverLetterZipBlob.value = coverLetter;
      // Show cover letter by default when both are generated
      zipBlob.value = coverLetter;
      lastGeneratedType.value = 'both';

      toast.add({
        title: 'Documents Generated Successfully',
        description: 'Your resume and cover letter have been generated and are ready for download (each includes PDF and TeX files).',
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

  const downloadZip = () => {
    if (!zipBlob.value) return;

    const url = URL.createObjectURL(zipBlob.value);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lastGeneratedType.value || 'document'}_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.add({
      title: 'Archive Downloaded',
      description: `Your ${lastGeneratedType.value || 'document'} archive (containing PDF and TeX files) has been downloaded successfully.`,
      color: 'success'
    });
  };

  const reset = () => {
    isLoading.value = false;
    zipBlob.value = null;
    resumeZipBlob.value = null;
    coverLetterZipBlob.value = null;
    lastGeneratedType.value = null;
  };

  return {
    // State
    isLoading: readonly(isLoading),
    zipBlob: readonly(zipBlob),
    resumeZipBlob: readonly(resumeZipBlob),
    coverLetterZipBlob: readonly(coverLetterZipBlob),
    lastGeneratedType: readonly(lastGeneratedType),
    
    // Configuration
    backendUrl,
    
    // Actions
    generateResume,
    generateCoverLetter,
    generateBoth,
    downloadZip,
    reset
  };
};
