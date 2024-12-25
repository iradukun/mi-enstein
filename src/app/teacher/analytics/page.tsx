"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeacherSidebar } from '@/components/teacher-sidebar'
import { BarChart, LineChart, PieChart } from '@/components/ui/chart'

export default function AnalyticsDashboard() {
  const { user } = useAuth()
  const [analyticsData, setAnalyticsData] = useState(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/analytics/teacher-dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setAnalyticsData(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    }
  }

  if (!analyticsData) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <TeacherSidebar />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Student Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={analyticsData.studentEngagement}
                index="date"
                categories={['activeStudents', 'questionsAsked']}
                colors={['blue', 'green']}
                valueFormatter={(value) => `${value} students`}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lesson Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={analyticsData.lessonCompletionRate}
                index="week"
                categories={['completionRate']}
                colors={['purple']}
                valueFormatter={(value) => `${value}%`}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={analyticsData.popularSubjects}
                index="subject"
                categories={['students']}
                colors={['red', 'blue', 'green', 'yellow', 'purple']}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

