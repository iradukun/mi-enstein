import { OpenAIStream, StreamingTextResponse } from '@vercel/ai'
import { Configuration, OpenAIApi } from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export async function textToSpeech(text: string) {
  const response = await openai.createSpeech({
    model: 'tts-1',
    voice: 'alloy',
    input: text,
  })

  return new Response(response.body)
}

