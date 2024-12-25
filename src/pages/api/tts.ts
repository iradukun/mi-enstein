import { NextApiRequest, NextApiResponse } from 'next'
import { textToSpeech } from '../../lib/tts'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body
    const audioStream = await textToSpeech(text)
    
    res.setHeader('Content-Type', 'audio/mpeg')
    res.send(audioStream)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

