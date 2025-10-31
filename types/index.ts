export interface ResumeAnalysisResult {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  overallScore: number
  atsScore: number
  readabilityScore: number
  skillsFound: string[]
  missingSkills: string[]
  suggestions: {
    critical: string[]
    important: string[]
    optional: string[]
  }
  grammarIssues: {
    type: string
    message: string
    suggestions: string[]
  }[]
  keywords: string[]
  analyzedAt: Date
}
