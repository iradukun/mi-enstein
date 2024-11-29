import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { Book, GraduationCap, Users } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="container space-y-8 py-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              +4 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Lessons
            </CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              +2 new lessons this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Student Progress
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Average completion rate
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentProgress />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FileUpload />
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <button className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted">
              <div className="flex items-center gap-4">
                <Book className="h-6 w-6" />
                <div className="grid gap-1">
                  <h3 className="font-medium">Create New Lesson</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate an AI-powered lesson from your materials
                  </p>
                </div>
              </div>
            </button>
            <button className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted">
              <div className="flex items-center gap-4">
                <Users className="h-6 w-6" />
                <div className="grid gap-1">
                  <h3 className="font-medium">Manage Students</h3>
                  <p className="text-sm text-muted-foreground">
                    View and manage your student roster
                  </p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

