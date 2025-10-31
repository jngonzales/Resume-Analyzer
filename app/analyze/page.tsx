'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, CheckCircle, FileText, Loader2, Sparkles, Upload } from 'lucide-react'

export default function AnalyzePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setError(null)
    setUploading(true)
    setProgress(10)

    try {
      // Upload file
      const formData = new FormData()
      formData.append('file', file)

      setProgress(30)
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const uploadData = await uploadResponse.json()
      setProgress(50)
      setUploading(false)
      setAnalyzing(true)

      // Analyze resume
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadData),
      })

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const analysisData = await analyzeResponse.json()
      setProgress(100)

      // Redirect to results
      setTimeout(() => {
        router.push(`/results/${analysisData.id}`)
      }, 500)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setUploading(false)
      setAnalyzing(false)
      setProgress(0)
    }
  }, [router])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading || analyzing,
  })

  if (status === 'loading' || status === 'unauthenticated') {
    return null
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
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <Sparkles className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-white">Analyze Your Resume</h1>
          <p className="text-gray-400">
            Upload your resume and get instant AI-powered feedback
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Upload Resume</CardTitle>
            <CardDescription className="text-gray-400">
              Supported formats: PDF, DOCX, TXT (Max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!uploading && !analyzing ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-400 bg-blue-400/10'
                    : 'border-gray-600 hover:border-blue-400 hover:bg-gray-700/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-lg font-medium text-white">Drop your resume here...</p>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-2 text-white">
                      Drag & drop your resume here
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      or click to browse files
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Select File</Button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6 py-8">
                <div className="text-center">
                  {uploading && (
                    <>
                      <Loader2 className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-spin" />
                      <h3 className="text-lg font-semibold mb-2 text-white">
                        Uploading your resume...
                      </h3>
                    </>
                  )}
                  {analyzing && (
                    <>
                      <Sparkles className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-pulse" />
                      <h3 className="text-lg font-semibold mb-2 text-white">
                        Analyzing with AI...
                      </h3>
                      <p className="text-sm text-gray-400">
                        This may take a few moments
                      </p>
                    </>
                  )}
                </div>
                <Progress value={progress} className="w-full" />
                <div className="text-center text-sm text-gray-400">
                  {progress}% complete
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <CheckCircle className="h-8 w-8 text-blue-400 mb-2" />
              <h3 className="font-semibold mb-1 text-white">ATS Optimization</h3>
              <p className="text-sm text-gray-400">
                Check compatibility with tracking systems
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-blue-400 mb-2" />
              <h3 className="font-semibold mb-1 text-white">Skill Analysis</h3>
              <p className="text-sm text-gray-400">
                Identify skills and gaps in your resume
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <Sparkles className="h-8 w-8 text-blue-400 mb-2" />
              <h3 className="font-semibold mb-1 text-white">AI Suggestions</h3>
              <p className="text-sm text-gray-400">
                Get actionable improvement tips
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
