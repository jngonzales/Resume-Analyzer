import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, FileText, Sparkles, TrendingUp, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-white">AI Resume Analyzer</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-gray-300 hover:text-white">Sign In</Button>
            </Link>
            <Link href="/auth/signin">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            Optimize Your Resume with{' '}
            <span className="text-primary">AI-Powered Analysis</span>
          </h1>
          <p className="text-xl text-gray-300">
            Get instant feedback on your resume. Improve ATS compatibility, discover skill gaps, 
            and increase your chances of landing interviews - completely free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/signin">
              <Button size="lg" className="text-lg px-8">
                Analyze Your Resume Free
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            ✓ No credit card required  ✓ 100% free forever  ✓ Instant results
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Everything You Need to Perfect Your Resume
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>ATS Optimization</CardTitle>
              <CardDescription>
                Ensure your resume passes Applicant Tracking Systems with our advanced scanning technology
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Skill Gap Analysis</CardTitle>
              <CardDescription>
                Discover missing skills and get recommendations based on industry standards
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Grammar Check</CardTitle>
              <CardDescription>
                Identify and fix grammar, spelling, and formatting issues automatically
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Readability Score</CardTitle>
              <CardDescription>
                Get insights on how easy your resume is to read and understand
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Instant Analysis</CardTitle>
              <CardDescription>
                Upload and get comprehensive feedback in seconds with AI power
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Multiple Formats</CardTitle>
              <CardDescription>
                Support for PDF, DOCX, and TXT file formats for your convenience
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-gray-800 to-gray-700 rounded-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold text-white">Upload Your Resume</h3>
            <p className="text-gray-300">
              Simply drag and drop your resume file or click to upload
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold text-white">AI Analysis</h3>
            <p className="text-gray-300">
              Our AI analyzes your resume for ATS compatibility, skills, and more
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold text-white">Get Results</h3>
            <p className="text-gray-300">
              Receive detailed feedback and actionable suggestions instantly
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Improve Your Resume?
          </h2>
          <p className="text-xl text-gray-300">
            Join thousands of job seekers who have improved their resumes with our free AI-powered tool
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="text-lg px-8">
              Start Analyzing Now - It's Free!
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>© 2025 AI Resume Analyzer. 100% Free Forever.</p>
        </div>
      </footer>
    </div>
  )
}
