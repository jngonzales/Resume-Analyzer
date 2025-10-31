import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export interface ResumeAnalysis {
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
}

// Common skills database for analysis
const commonSkills = {
  technical: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'Git', 'CI/CD', 'Jenkins', 'GitHub Actions', 'REST API', 'GraphQL', 'Microservices'
  ],
  soft: [
    'Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking',
    'Project Management', 'Agile', 'Scrum', 'Time Management', 'Collaboration'
  ]
}

// ATS-friendly keywords
const atsKeywords = [
  'experience', 'managed', 'led', 'developed', 'created', 'implemented', 'designed',
  'achieved', 'improved', 'increased', 'reduced', 'analyzed', 'coordinated'
]

export async function analyzeResume(text: string): Promise<ResumeAnalysis> {
  const cleanText = text.toLowerCase()
  
  // Find skills
  const skillsFound = [
    ...commonSkills.technical.filter(skill => cleanText.includes(skill.toLowerCase())),
    ...commonSkills.soft.filter(skill => cleanText.includes(skill.toLowerCase()))
  ]
  
  // Suggest missing popular skills
  const missingSkills = [
    ...commonSkills.technical.filter(skill => !cleanText.includes(skill.toLowerCase())),
    ...commonSkills.soft.filter(skill => !cleanText.includes(skill.toLowerCase()))
  ].slice(0, 10) // Top 10 missing skills
  
  // Check ATS optimization
  const foundKeywords = atsKeywords.filter(keyword => cleanText.includes(keyword))
  const atsScore = Math.min(100, Math.round((foundKeywords.length / atsKeywords.length) * 100) + 20)
  
  // Basic readability analysis
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1)
  
  let readabilityScore = 100
  if (avgWordsPerSentence > 25) readabilityScore -= 20
  if (avgWordsPerSentence > 30) readabilityScore -= 20
  if (words.length < 200) readabilityScore -= 30
  if (text.length < 500) readabilityScore -= 20
  readabilityScore = Math.max(0, readabilityScore)
  
  // Generate suggestions using Hugging Face
  const suggestions = await generateSuggestions(text, skillsFound, foundKeywords, atsScore)
  
  // Grammar check (basic rules-based for free tier)
  const grammarIssues = await checkGrammar(text)
  
  // Calculate overall score
  const skillScore = Math.min(100, (skillsFound.length / 15) * 100)
  const overallScore = Math.round(
    (atsScore * 0.3) + (readabilityScore * 0.3) + (skillScore * 0.4)
  )
  
  return {
    overallScore,
    atsScore,
    readabilityScore,
    skillsFound,
    missingSkills,
    suggestions,
    grammarIssues,
    keywords: foundKeywords
  }
}

async function generateSuggestions(
  text: string,
  skillsFound: string[],
  keywords: string[],
  atsScore: number
): Promise<ResumeAnalysis['suggestions']> {
  const suggestions = {
    critical: [] as string[],
    important: [] as string[],
    optional: [] as string[]
  }
  
  // Critical suggestions
  if (text.length < 500) {
    suggestions.critical.push('Your resume is too short. Aim for at least 500-800 words to properly showcase your experience.')
  }
  if (skillsFound.length < 5) {
    suggestions.critical.push('Add more relevant skills to your resume. Include both technical and soft skills.')
  }
  if (!text.toLowerCase().includes('experience') && !text.toLowerCase().includes('work history')) {
    suggestions.critical.push('Include a clear work experience section with your previous roles.')
  }
  
  // Important suggestions
  if (atsScore < 60) {
    suggestions.important.push('Use more action verbs (managed, led, developed, created, implemented) to improve ATS compatibility.')
  }
  if (!text.includes('http') && !text.includes('linkedin') && !text.includes('github')) {
    suggestions.important.push('Add links to your LinkedIn profile, GitHub, or personal website.')
  }
  if (keywords.length < 5) {
    suggestions.important.push('Include more industry-standard keywords to improve ATS scanning.')
  }
  
  // Optional suggestions
  suggestions.optional.push('Consider adding quantifiable achievements (e.g., "Increased sales by 25%").')
  suggestions.optional.push('Ensure your resume is in a clean, professional format.')
  suggestions.optional.push('Tailor your resume for each job application by matching keywords from the job description.')
  
  // Try to get AI-powered suggestions (with fallback)
  try {
    const prompt = `Resume excerpt: "${text.substring(0, 500)}..."\nProvide 2 brief improvement suggestions:`
    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
        return_full_text: false
      }
    })
    
    if (response.generated_text) {
      const aiSuggestions = response.generated_text.trim().split('\n').filter(s => s.length > 10)
      suggestions.optional.push(...aiSuggestions.slice(0, 2))
    }
  } catch (error) {
    console.error('AI suggestion generation failed:', error)
    // Continue with rule-based suggestions
  }
  
  return suggestions
}

async function checkGrammar(text: string): Promise<ResumeAnalysis['grammarIssues']> {
  const issues: ResumeAnalysis['grammarIssues'] = []
  
  // Basic grammar checks
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  sentences.forEach((sentence, index) => {
    const trimmed = sentence.trim()
    
    // Check if sentence starts with lowercase
    if (trimmed.length > 0 && trimmed[0] === trimmed[0].toLowerCase() && index > 0) {
      issues.push({
        type: 'capitalization',
        message: `Sentence should start with a capital letter: "${trimmed.substring(0, 50)}..."`,
        suggestions: [trimmed.charAt(0).toUpperCase() + trimmed.slice(1)]
      })
    }
    
    // Check for very short sentences
    if (trimmed.split(' ').length < 3 && trimmed.length > 0) {
      issues.push({
        type: 'sentence_length',
        message: `Very short sentence detected. Consider expanding: "${trimmed}"`,
        suggestions: ['Add more detail to this sentence']
      })
    }
    
    // Check for very long sentences
    if (trimmed.split(' ').length > 35) {
      issues.push({
        type: 'sentence_length',
        message: `Very long sentence detected. Consider breaking it up.`,
        suggestions: ['Split into multiple sentences for better readability']
      })
    }
  })
  
  // Check for common mistakes
  const commonMistakes = [
    { wrong: /\bi\s/gi, right: 'I', message: 'Pronoun "I" should be capitalized' },
    { wrong: /\s{2,}/g, right: ' ', message: 'Multiple spaces detected' },
    { wrong: /\s,/g, right: ',', message: 'Space before comma' },
    { wrong: /\s\./g, right: '.', message: 'Space before period' },
  ]
  
  commonMistakes.forEach(({ wrong, right, message }) => {
    if (wrong.test(text)) {
      issues.push({
        type: 'formatting',
        message,
        suggestions: [`Replace with: "${right}"`]
      })
    }
  })
  
  return issues.slice(0, 10) // Limit to 10 issues
}

// Classification helper for resume sections
export async function classifyResumeSection(text: string): Promise<string> {
  try {
    const response = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: text,
      parameters: {
        candidate_labels: ['experience', 'education', 'skills', 'summary', 'projects', 'certifications']
      }
    }) as any
    
    return response.labels?.[0] || 'unknown'
  } catch (error) {
    console.error('Section classification failed:', error)
    return 'unknown'
  }
}
