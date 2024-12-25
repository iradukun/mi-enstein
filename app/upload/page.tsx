"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from 'lucide-react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically handle the file upload to your server
    console.log('File to upload:', file)
    console.log('Additional notes:', notes)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upload Materials</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Book or Scheme of Work</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">File</Label>
              <Input id="file" type="file" onChange={handleFileChange} />
            </div>
            <div>
              <Label>File Type</Label>
              <div className="mt-2 flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="fileType" value="book" className="h-4 w-4" />
                  <span>Book</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="fileType" value="scheme" className="h-4 w-4" />
                  <span>Scheme of Work</span>
                </label>
              </div>
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes or instructions for lesson customization..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={!file}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recently Uploaded</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center justify-between rounded-lg border p-2">
              <span>Advanced Mathematics Grade 10.pdf</span>
              <span className="text-sm text-gray-500">Uploaded 2 hours ago</span>
            </li>
            <li className="flex items-center justify-between rounded-lg border p-2">
              <span>Biology Scheme of Work.docx</span>
              <span className="text-sm text-gray-500">Uploaded yesterday</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

