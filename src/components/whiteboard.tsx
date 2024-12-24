import React, { useRef, useEffect } from 'react'

interface WhiteboardProps {
  text: string
}

export function Whiteboard({ text }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up the text style
    ctx.font = '24px Arial'
    ctx.fillStyle = 'white'

    // Write the text on the canvas
    const lines = text.split('\n')
    lines.forEach((line, index) => {
      ctx.fillText(line, 20, 40 + index * 30)
    })
  }, [text])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="bg-gray-800 rounded-lg shadow-lg"
    />
  )
}

