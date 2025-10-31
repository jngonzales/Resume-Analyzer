'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, LogOut, PlusCircle, Sparkles, TrendingUp } from 'lucide-react'

interface Analysis {
  id: string
  fileName: string
  overallScore: number
  atsScore: number
  readabilityScore: number
  analyzedAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAnalyses()
    }
  }, [status])

  const fetchAnalyses = async () => {
    try {
      const response = await fetch('/api/user/analyses')
      if (response.ok) {
        const data = await response.json()
        setAnalyses(data)
      }
    } catch (error) {
      console.error('Failed to fetch analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">AI Resume Analyzer</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">
              {session?.user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-gray-300 hover:text-white hover:bg-gray-700">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-gray-400">
            Analyze your resume and track your improvements
          </p>
        </div>

        {/* Quick Action */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-white">Ready to analyze a new resume?</CardTitle>
            <CardDescription className="text-blue-100">
              Upload your resume and get instant AI-powered feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/analyze">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <PlusCircle className="mr-2 h-5 w-5" />
                Analyze New Resume
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Analyses
              </CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyses.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Average Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {analyses.length > 0
                  ? Math.round(
                      analyses.reduce((sum, a) => sum + a.overallScore, 0) /
                        analyses.length
                    )
                  : 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Latest Score
              </CardTitle>
              <Sparkles className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {analyses.length > 0 ? analyses[0].overallScore : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Analyses</CardTitle>
            <CardDescription className="text-gray-400">
              Your resume analysis history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full bg-gray-700" />
                ))}
              </div>
            ) : analyses.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">No analyses yet</h3>
                <p className="text-gray-400 mb-4">
                  Upload your first resume to get started
                </p>
                <Link href="/analyze">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Analyze Resume
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <Link
                    key={analysis.id}
                    href={`/results/${analysis.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-blue-400" />
                        <div>
                          <h4 className="font-semibold text-white">{analysis.fileName}</h4>
                          <p className="text-sm text-gray-400">
                            {new Date(analysis.analyzedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">
                          {analysis.overallScore}
                        </div>
                        <p className="text-xs text-gray-400">
                          Overall Score
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
