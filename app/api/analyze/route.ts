import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { analyzeResume } from '@/lib/ai'
import { ensureUserExists } from '@/lib/ensure-user'
import pdf from 'pdf-parse'
import mammoth from 'mammoth'

async function extractTextFromFile(url: string, fileType: string): Promise<string> {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()

  if (fileType === 'application/pdf') {
    const data = await pdf(Buffer.from(buffer))
    return data.text
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) })
    return result.value
  } else if (fileType === 'text/plain') {
    return Buffer.from(buffer).toString('utf-8')
  }

  throw new Error('Unsupported file type')
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user exists in database
    const userId = await ensureUserExists(session.user.email, session.user.name, session.user.image)

    const body = await request.json()
    const { url, fileName, fileSize, fileType } = body

    if (!url || !fileName || !fileSize || !fileType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Extract text from file
    const text = await extractTextFromFile(url, fileType)

    if (text.length < 50) {
      return NextResponse.json({ error: 'Resume text is too short. Please upload a complete resume.' }, { status: 400 })
    }

    // Analyze with AI
    const analysis = await analyzeResume(text)

    // Save to database
    const savedAnalysis = await prisma.analysis.create({
      data: {
        userId,
        fileName,
        fileUrl: url,
        fileSize,
        fileType,
        overallScore: analysis.overallScore,
        atsScore: analysis.atsScore,
        readabilityScore: analysis.readabilityScore,
        skillsFound: analysis.skillsFound,
        missingSkills: analysis.missingSkills,
        suggestions: analysis.suggestions,
        grammarIssues: analysis.grammarIssues,
        keywords: analysis.keywords,
      },
    })

    return NextResponse.json({
      id: savedAnalysis.id,
      ...analysis,
      analyzedAt: savedAnalysis.analyzedAt,
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}
