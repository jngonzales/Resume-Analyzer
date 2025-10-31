'use client'

import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  FileText,
  Lightbulb,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Info,
} from 'lucide-react'

interface AnalysisResult {
  id: string
  fileName: string
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
  analyzedAt: string
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  return 'Needs Improvement'
}

export default function ResultsPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated' && params.id) {
      fetchResult()
    }
  }, [status, params.id])

  const fetchResult = async () => {
    try {
      const response = await fetch('/api/user/analyses')
      if (response.ok) {
        const data = await response.json()
        const analysis = data.find((a: AnalysisResult) => a.id === params.id)
        if (analysis) {
          setResult(analysis)
        }
      }
    } catch (error) {
      console.error('Failed to fetch result:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || status === 'unauthenticated' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8 bg-gray-700" />
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 bg-gray-700" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="max-w-md bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Analysis Not Found</CardTitle>
            <CardDescription className="text-gray-400">
              The requested analysis could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">{result.fileName}</h1>
          </div>
          <p className="text-gray-400">
            Analyzed on {new Date(result.analyzedAt).toLocaleString()}
          </p>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">
                Overall Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>
                {result.overallScore}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {getScoreLabel(result.overallScore)}
              </p>
              <Progress value={result.overallScore} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">
                ATS Compatibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getScoreColor(result.atsScore)}`}>
                {result.atsScore}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {getScoreLabel(result.atsScore)}
              </p>
              <Progress value={result.atsScore} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">
                Readability Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getScoreColor(result.readabilityScore)}`}>
                {result.readabilityScore}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {getScoreLabel(result.readabilityScore)}
              </p>
              <Progress value={result.readabilityScore} className="mt-4" />
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="suggestions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">Suggestions</TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">Skills</TabsTrigger>
            <TabsTrigger value="grammar" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">Grammar</TabsTrigger>
            <TabsTrigger value="keywords" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">Keywords</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-4">
            {result.suggestions.critical.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <CardTitle className="text-white">Critical Issues</CardTitle>
                  </div>
                  <CardDescription className="text-gray-400">
                    These issues should be addressed immediately
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.suggestions.critical.map((suggestion, index) => (
                      <li key={index} className="flex gap-2 text-gray-300">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.suggestions.important.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <CardTitle className="text-white">Important Improvements</CardTitle>
                  </div>
                  <CardDescription className="text-gray-400">
                    Recommended changes to enhance your resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.suggestions.important.map((suggestion, index) => (
                      <li key={index} className="flex gap-2 text-gray-300">
                        <span className="text-yellow-500 font-bold">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.suggestions.optional.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-white">Optional Enhancements</CardTitle>
                  </div>
                  <CardDescription className="text-gray-400">
                    Additional tips to make your resume stand out
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.suggestions.optional.map((suggestion, index) => (
                      <li key={index} className="flex gap-2 text-gray-300">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-white">Skills Found ({result.skillsFound.length})</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Skills identified in your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.skillsFound.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-900/50 text-green-400 border border-green-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-white">Suggested Skills to Add</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Popular skills that could enhance your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.slice(0, 15).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-900/50 text-blue-400 border border-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grammar">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Grammar & Formatting Issues</CardTitle>
                <CardDescription className="text-gray-400">
                  {result.grammarIssues.length === 0
                    ? 'No major issues found!'
                    : `${result.grammarIssues.length} issue(s) detected`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.grammarIssues.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-white">Great job!</p>
                    <p className="text-gray-400">
                      No significant grammar or formatting issues found.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {result.grammarIssues.map((issue, index) => (
                      <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2 bg-gray-700/50">
                        <p className="font-medium capitalize text-white">{issue.type.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-400">{issue.message}</p>
                        {issue.suggestions.length > 0 && (
                          <p className="text-sm text-blue-400 mt-1">
                            Suggestion: {issue.suggestions[0]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">ATS Keywords Found</CardTitle>
                <CardDescription className="text-gray-400">
                  Action words and keywords detected in your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-900/50 text-blue-400 border border-blue-700 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                {result.keywords.length < 5 && (
                  <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                    <p className="text-sm text-yellow-400">
                      <strong>Tip:</strong> Add more action verbs like "managed", "developed", 
                      "implemented", "created" to improve ATS compatibility.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/analyze">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze Another Resume
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
