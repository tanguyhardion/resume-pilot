// Environment-based backend URL configuration
const getBackendUrl = (): string => {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3001" // Local backend for development
    : "https://resume-pilot-backend.vercel.app"; // Production backend
};

export class ResumeApiService {
  private readonly backendUrl: string;

  constructor() {
    this.backendUrl = getBackendUrl();
  }

  async generateResume(
    jobOffer: string,
    masterPassword?: string,
    personalInfo?: PersonalInfo
  ): Promise<Blob> {
    const payload: ResumeRequest = {
      jobOffer,
      masterPassword: masterPassword || "",
      personalInfo,
    };

    const response = await fetch(`${this.backendUrl}/api/generateResume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    // The response is now a ZIP file containing both PDF and TeX
    return await response.blob();
  }

  async generateCoverLetter(
    jobOffer: string,
    masterPassword?: string,
    personalInfo?: PersonalInfo
  ): Promise<Blob> {
    const payload: CoverLetterRequest = {
      jobOffer,
      masterPassword: masterPassword || "",
      personalInfo,
    };

    const response = await fetch(`${this.backendUrl}/api/generateCoverLetter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    // The response is now a ZIP file containing both PDF and TeX
    return await response.blob();
  }

  async generateBoth(
    jobOffer: string,
    masterPassword?: string,
    personalInfo?: PersonalInfo
  ): Promise<{ resume: Blob; coverLetter: Blob }> {
    // Generate both resume and cover letter in parallel
    const [resume, coverLetter] = await Promise.all([
      this.generateResume(jobOffer, masterPassword, personalInfo),
      this.generateCoverLetter(jobOffer, masterPassword, personalInfo),
    ]);

    return { resume, coverLetter };
  }
}

// Export a singleton instance
export const resumeApiService = new ResumeApiService();
