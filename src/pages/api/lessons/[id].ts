import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongodb'
import Lesson from '../../../models/Lesson'
import { authMiddleware } from '../../../lib/authMiddleware'

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const lesson = await Lesson.findById(id)
        if (!lesson) {
          return res.status(404).json({ success: false, message: 'Lesson not found' })
        }
        res.status(200).json({ success: true, data: lesson })
      } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message })
      }
      break

    case 'PUT':
      try {
        const lesson = await Lesson.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })
        if (!lesson) {
          return res.status(404).json({ success: false, message: 'Lesson not found' })
        }
        res.status(200).json({ success: true, data: lesson })
      } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message })
      }
      break

    case 'DELETE':
      try {
        const deletedLesson = await Lesson.deleteOne({ _id: id })
        if (!deletedLesson) {
          return res.status(404).json({ success: false, message: 'Lesson not found' })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message })
      }
      break

    default:
      res.status(405).json({ success: false, message: `Method ${method} Not Allowed` })
  }
}

export default authMiddleware(handler)

