"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Play } from 'lucide-react'
import { StudentSidebar } from '@/components/student-sidebar'
import { AITutor } from '@/components/ai-tutor'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [showAITutor, setShowAITutor] = useState(false)
  const [lessons, setLessons] = useState([])
  const [selectedLesson, setSelectedLesson] = useState(null)

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

  const startLesson = (lesson) => {
    setSelectedLesson(lesson)
    setShowAITutor(true)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <StudentSidebar />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {['Mathematics', 'Science', 'History'].map((subject) => (
            <Card key={subject}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{subject}</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Progress value={75} className="mt-2" />
                <p className="mt-2 text-sm text-gray-600">15 of 20 lessons completed</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {!showAITutor && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Available Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lessons.map((lesson) => (
                  <li key={lesson._id} className="flex items-center justify-between rounded-lg border p-2">
                    <span>{lesson.title}</span>
                    <Button onClick={() => startLesson(lesson)}>
                      <Play className="mr-2 h-4 w-4" /> Start Lesson
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {showAITutor && selectedLesson && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>AI Tutor - {selectedLesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <AITutor 
                initialPrompt={`You are an AI tutor teaching a lesson on ${selectedLesson.title}. Start by introducing the topic and then explain key concepts. Use the virtual whiteboard to write important points, formulas, or draw diagrams as you speak. Pause occasionally to check if the student has any questions.`} 
                lessonId={selectedLesson._id}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

