import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      await dbConnect()

      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' })
      }

      const isMatch = await compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' })
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
      )

      res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message })
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' })
  }
}

