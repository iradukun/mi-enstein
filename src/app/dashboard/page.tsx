"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (user.role === 'teacher') {
        router.push('/teacher')
      } else {
        router.push('/student')
      }
    } else {
      router.push('/login')
    }
  }, [user, router])

  return <div>Redirecting...</div>
}

