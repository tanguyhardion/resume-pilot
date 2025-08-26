export class ResumeApiService {
  private backendUrl: string;

  constructor(backendUrl = 'http://localhost:3001') {
    this.backendUrl = backendUrl;
  }

  setBackendUrl(url: string) {
    this.backendUrl = url;
  }

  async generateResume(jobOffer: string, masterPassword?: string, personalInfo?: PersonalInfo): Promise<Blob> {
    const payload: ResumeRequest = {
      jobOffer,
      masterPassword: masterPassword || '',
      personalInfo
    };

    const response = await fetch(`${this.backendUrl}/api/generateResume`, {
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

    return await response.blob();
  }

  async generateCoverLetter(jobOffer: string, masterPassword?: string, personalInfo?: PersonalInfo): Promise<Blob> {
    const payload: CoverLetterRequest = {
      jobOffer,
      masterPassword: masterPassword || '',
      personalInfo
    };

    const response = await fetch(`${this.backendUrl}/api/generateCoverLetter`, {
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

    return await response.blob();
  }

  async generateBoth(jobOffer: string, masterPassword?: string, personalInfo?: PersonalInfo): Promise<{ resume: Blob; coverLetter: Blob }> {
    const payload = {
      jobOffer,
      masterPassword: masterPassword || '',
      personalInfo
    };

    // Generate both resume and cover letter in parallel
    const [resumeResponse, coverLetterResponse] = await Promise.all([
      fetch(`${this.backendUrl}/api/generateResume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }),
      fetch(`${this.backendUrl}/api/generateCoverLetter`, {
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

    const [resume, coverLetter] = await Promise.all([
      resumeResponse.blob(),
      coverLetterResponse.blob()
    ]);

    return { resume, coverLetter };
  }
}

// Export a singleton instance
export const resumeApiService = new ResumeApiService();
