import { Configuration, OpenAIApi } from 'openai-edge'
// Import a text-to-speech library
import { TextToSpeechClient } from '@google-cloud/text-to-speech'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)
const ttsClient = new TextToSpeechClient()

export async function textToSpeech(text: string) {
  const [response] = await ttsClient.synthesizeSpeech({
    input: { text },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  })

  return new Response(response.audioContent, {
    headers: { 'Content-Type': 'audio/mpeg' }
  })
}

