import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongodb'
import Lesson from '../../../models/Lesson'
import { authMiddleware, authorizeRoles } from '../../../lib/authMiddleware'
import { lessonSchema } from '../../../lib/validation'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const lessons = await Lesson.find(req.user.role === 'student' ? {} : { teacherId: req.user.id })
      res.status(200).json({ success: true, data: lessons })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const validatedData = lessonSchema.parse(req.body)
      const lesson = await Lesson.create({ ...validatedData, teacherId: req.user.id })
      res.status(201).json({ success: true, data: lesson })
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: error.errors })
      } else {
        res.status(500).json({ success: false, message: 'Server error' })
      }
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' })
  }
}

export default authMiddleware(authorizeRoles('teacher')(handler))

