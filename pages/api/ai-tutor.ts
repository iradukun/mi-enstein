import { NextApiRequest, NextApiResponse } from 'next'
import { OpenAIStream, StreamingTextResponse } from '@vercel/ai'
import { Configuration, OpenAIApi } from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = await req.json()

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are an AI tutor specializing in secondary education. Provide clear, concise explanations and always encourage further questions.'
      },
      { role: 'user', content: prompt }
    ],
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

