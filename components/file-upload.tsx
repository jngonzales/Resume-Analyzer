'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, X, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onUploadComplete?: (data: any) => void
  onUploadError?: (error: string) => void
}

export function FileUpload({ onUploadComplete, onUploadError }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: uploading,
  })

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      setProgress(30)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      setProgress(100)

      if (onUploadComplete) {
        onUploadComplete(data)
      }
    } catch (error: any) {
      if (onUploadError) {
        onUploadError(error.message)
      }
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  if (file) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            {!uploading && (
              <Button variant="ghost" size="sm" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {progress}%
              </p>
            </div>
          )}

          {!uploading && (
            <Button className="w-full" onClick={handleUpload}>
              <Upload className="mr-2 h-4 w-4" />
              Upload & Analyze
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary hover:bg-accent'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      {isDragActive ? (
        <p className="text-lg font-medium">Drop your resume here...</p>
      ) : (
        <>
          <p className="text-lg font-medium mb-2">
            Drag & drop your resume here
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse files
          </p>
          <Button type="button">Select File</Button>
          <p className="text-xs text-muted-foreground mt-4">
            Supported: PDF, DOCX, TXT (Max 5MB)
          </p>
        </>
      )}
    </div>
  )
}
