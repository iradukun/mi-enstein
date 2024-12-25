import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongodb'
import UserActivity from '../../../models/UserActivity'
import { authMiddleware } from '../../../lib/authMiddleware'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await dbConnect()

      const { activityType, details } = req.body
      const activity = await UserActivity.create({
        userId: req.user.id,
        activityType,
        details,
      })

      res.status(201).json({ success: true, data: activity })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' })
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' })
  }
}

export default authMiddleware(handler)

