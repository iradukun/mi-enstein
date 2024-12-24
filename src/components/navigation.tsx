"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useAuth } from './auth-provider'

export function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (pathname === '/') return null

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-blue-600">Mi-enstein</h1>
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link href={user.role === 'teacher' ? '/teacher' : '/student'}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

