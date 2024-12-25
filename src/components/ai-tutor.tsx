"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pause, Play, Mic, Send } from 'lucide-react'
import { useChat } from 'ai/react'
import { useAuth } from '@/components/auth-provider'
import { Whiteboard } from './whiteboard'

const textToSpeech = async (text: string) => {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate speech')
  }

  const audioBlob = await response.blob()
  return URL.createObjectURL(audioBlob)
}

export function AITutor({ initialPrompt = '', lessonId = '' }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [whiteboardText, setWhiteboardText] = useState('')
  const { user } = useAuth()

  const audioRef = useRef(new Audio())
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: '/api/ai/tutor',
    initialMessages: initialPrompt ? [{ id: 'initial', role: 'system', content: initialPrompt }] : [],
  })

  useEffect(() => {
    if (isPlaying && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant') {
        const lines = lastMessage.content.split('\n')
        let currentLine = 0
        
        const speakAndWrite = async () => {
          if (currentLine < lines.length) {
            const line = lines[currentLine]
            const audioUrl = await textToSpeech(line)
            audioRef.current.src = audioUrl
            audioRef.current.onended = () => {
              currentLine++
              speakAndWrite()
            }
            audioRef.current.play()
            setWhiteboardText(prevText => prevText + line + '\n')
          } else {
            setIsPlaying(false)
          }
        }

        speakAndWrite()
      }
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, messages])

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

        handleInputChange({ target: { value: transcript } } as React.ChangeEvent<HTMLInputElement>)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [handleInputChange])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
    }
    setIsListening(!isListening)
  }

  const logActivity = async (activityType: string, details: any) => {
    try {
      await fetch('/api/analytics/log-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ activityType, details }),
      })
    } catch (error) {
      console.error('Failed to log activity:', error)
    }
  }

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    await logActivity('ask_question', { lessonId, question: input })
    const userQuestion = input
    handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
    await append({ role: 'user', content: userQuestion })
    setIsPlaying(true)
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <Whiteboard text={whiteboardText} />
        </div>
        <div className="w-1/3 h-[600px] overflow-y-auto border rounded p-4 bg-white">
          {messages.map((message, i) => (
            <div key={i} className={`mb-4 ${message.role === 'assistant' ? 'text-blue-600' : 'text-green-600'}`}>
              <strong>{message.role === 'assistant' ? 'AI Tutor: ' : 'You: '}</strong>
              {message.content}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={handlePlayPause}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button onClick={toggleListening} variant={isListening ? "destructive" : "default"}>
          <Mic className="h-4 w-4" />
        </Button>
        <form onSubmit={handleAskQuestion} className="flex-1 flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question..."
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

