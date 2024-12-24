"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './auth-provider'
import { Button } from "@/components/ui/button"
import { BarChart, BookOpen, LogOut, Settings, Upload, Users } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/teacher', icon: BarChart },
  { name: 'Upload Materials', href: '/teacher/upload', icon: Upload },
  { name: 'Manage Students', href: '/teacher/students', icon: Users },
  { name: 'Settings', href: '/teacher/settings', icon: Settings },
]

export function TeacherSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="flex flex-col w-64 bg-white shadow-md">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">Mi-enstein</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2 p-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    pathname === item.href ? 'bg-gray-100' : ''
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <Button variant="outline" className="w-full" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
