"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, BookOpen, Users, Brain, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">Mi-enstein</h1>
          <div className="space-x-4">
            <Button variant="ghost">Login</Button>
            <Button>Sign Up</Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">Welcome to Mi-enstein</h2>
          <p className="text-xl text-gray-600 mb-8">Revolutionizing education with AI-powered personalized learning</p>
          <Button size="lg" className="animate-pulse">
            Get Started <ChevronRight className="ml-2" />
          </Button>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-4">
            <h3 className="text-3xl font-semibold">Personalized Learning Journey</h3>
            <p className="text-gray-600">Our AI-powered platform adapts to your learning style, providing tailored lessons and real-time feedback to help you excel in your studies.</p>
          </div>
          <div className="bg-blue-100 rounded-lg p-8 shadow-inner">
            <div className="animate-float bg-white rounded-lg p-4 shadow-md">
              <p className="font-mono text-sm">
                AI: Let's explore the concept of derivatives in calculus. We'll start with the basic definition and then move on to practical applications.
              </p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { title: "Interactive Lessons", icon: BookOpen, description: "Engage with dynamic, AI-driven lessons that adapt to your pace and style." },
            { title: "Real-time Assistance", icon: Zap, description: "Get instant help and explanations whenever you need them, 24/7." },
            { title: "Progress Tracking", icon: Brain, description: "Monitor your growth with detailed analytics and personalized insights." },
          ].map((feature, index) => (
            <Card key={index} className="transition-transform hover:scale-105">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-blue-500 mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="text-center mb-16">
          <h3 className="text-3xl font-semibold mb-4">Join thousands of satisfied learners</h3>
          <div className="flex justify-center items-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-600 mb-8">"Mi-enstein has transformed the way I learn. The AI tutor feels like a personal mentor, always there to help!"</p>
          <div className="flex justify-center items-center">
            <Users className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-2xl font-bold text-blue-600">10,000+</span>
            <span className="ml-2 text-gray-600">active learners</span>
          </div>
        </section>

        <section className="text-center">
          <h3 className="text-3xl font-semibold mb-4">Ready to transform your learning experience?</h3>
          <Button size="lg">
            Start Your Journey Today <ChevronRight className="ml-2" />
          </Button>
        </section>
      </main>

      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2023 Mi-enstein. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

