"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Loader2 } from 'lucide-react'
import { TeacherSidebar } from '@/components/teacher-sidebar'
import { parseContent, structureContent } from '@/lib/contentParser'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedContent, setUploadedContent] = useState<{ [key: string]: string } | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) return

    setIsUploading(true)
    try {
      const content = await parseContent(file)
      const structuredContent = structureContent(content)
      setUploadedContent(structuredContent)

      // Here you would typically send the structured content to your backend
      console.log('Structured content:', structuredContent)
      console.log('Additional notes:', notes)

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      alert('Content uploaded and parsed successfully!')
    } catch (error) {
      console.error('Error parsing content:', error)
      alert('Error parsing content. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <TeacherSidebar />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Upload Materials</h1>
        <Card>
          <CardHeader>
            <CardTitle>Upload Book or Scheme of Work</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file">File</Label>
                <Input id="file" type="file" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any additional notes or instructions for content parsing..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!file || isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload and Parse
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        {uploadedContent && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Parsed Content Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">
                {JSON.stringify(uploadedContent, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

