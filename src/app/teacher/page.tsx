"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BarChart, BookOpen, Users, Plus, Loader2 } from 'lucide-react'
import { TeacherSidebar } from '@/components/teacher-sidebar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonContent, setLessonContent] = useState('')
  const [lessons, setLessons] = useState([])
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false)
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons')
      const data = await response.json()
      if (data.success) {
        setLessons(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error)
    }
  }

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: lessonTitle,
          content: lessonContent,
          subject,
          teacherId: user?.id,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setLessonTitle('')
        setLessonContent('')
        setSubject('')
        fetchLessons()
      }
    } catch (error) {
      console.error('Failed to create lesson:', error)
    }
  }

  const handleGenerateLesson = async () => {
    setIsGeneratingLesson(true)
    try {
      const response = await fetch('/api/ai/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, topic, gradeLevel }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate lesson')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let generatedContent = ''

      while (true) {
        const { done, value } = await reader?.read()
        if (done) break
        generatedContent += decoder.decode(value)
        setLessonContent(generatedContent)
      }

      setLessonTitle(`${subject}: ${topic} (Grade ${gradeLevel})`)
    } catch (error) {
      console.error('Error generating lesson:', error)
      alert('Failed to generate lesson. Please try again.')
    } finally {
      setIsGeneratingLesson(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <TeacherSidebar />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+20% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created Lessons</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lessons.length}</div>
              <p className="text-xs text-muted-foreground">Total lessons created</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Performance</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground">Accuracy in answering questions</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Create New Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="lesson-title">Lesson Title</Label>
                <Input 
                  id="lesson-title" 
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="e.g., Introduction to Algebra" 
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="literature">Literature</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="topic">Topic</Label>
                <Input 
                  id="topic" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Photosynthesis" 
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="grade-level">Grade Level</Label>
                <Select value={gradeLevel} onValueChange={setGradeLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="lesson-content">Lesson Content</Label>
                <Textarea 
                  id="lesson-content" 
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  placeholder="Enter the main content of the lesson..." 
                  rows={10}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="button" onClick={handleGenerateLesson} disabled={isGeneratingLesson || !subject || !topic || !gradeLevel}>
                  {isGeneratingLesson ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Generate with AI
                    </>
                  )}
                </Button>
                <Button type="submit">Create Lesson</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lessons.map((lesson) => (
                <li key={lesson._id} className="flex items-center justify-between rounded-lg border p-2">
                  <span>{lesson.title}</span>
                  <span className="text-sm text-gray-500">{new Date(lesson.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

