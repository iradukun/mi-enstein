import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

const activities = [
  {
    id: 1,
    user: {
      name: "John Smith",
      image: "/avatars/01.png",
      initials: "JS",
    },
    action: "completed",
    subject: "Introduction to Physics",
    time: "2 minutes ago",
  },
  {
    id: 2,
    user: {
      name: "Sarah Johnson",
      image: "/avatars/02.png",
      initials: "SJ",
    },
    action: "started",
    subject: "Chemical Bonding",
    time: "5 minutes ago",
  },
  {
    id: 3,
    user: {
      name: "Michael Brown",
      image: "/avatars/03.png",
      initials: "MB",
    },
    action: "asked a question in",
    subject: "Algebra Basics",
    time: "10 minutes ago",
  },
  {
    id: 4,
    user: {
      name: "Emily Davis",
      image: "/avatars/04.png",
      initials: "ED",
    },
    action: "achieved 100% in",
    subject: "Literary Analysis",
    time: "15 minutes ago",
  },
]

export function RecentActivity() {
  return (
    <ScrollArea className="h-[350px]">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.image} alt={activity.user.name} />
              <AvatarFallback>{activity.user.initials}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span>{" "}
                {activity.action}{" "}
                <span className="font-medium">{activity.subject}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

