import { NextApiRequest, NextApiResponse } from 'next'
import { OpenAIStream, StreamingTextResponse } from '@vercel/ai'
import { Configuration, OpenAIApi } from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { subject, topic, gradeLevel } = await req.json()

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are an AI specialized in creating educational content. Generate a detailed lesson plan.'
      },
      {
        role: 'user',
        content: `Create a lesson plan for ${subject} on the topic of "${topic}" for grade ${gradeLevel}. Include learning objectives, main content, activities, and assessment ideas.`
      }
    ],
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

