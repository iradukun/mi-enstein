"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Book, BarChart, Settings, User, Users } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/', icon: BarChart },
  { name: 'Upload', href: '/upload', icon: Book },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">Mi-enstein</h1>
      </div>
      <ul className="space-y-2 p-4">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`flex items-center space-x-3 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                pathname === item.href ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

