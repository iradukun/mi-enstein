import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'
import { hash } from 'bcrypt'
import { userSchema } from '../../../lib/validation'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      await dbConnect()

      const validatedData = userSchema.parse(req.body)

      const existingUser = await User.findOne({ email: validatedData.email })
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' })
      }

      const hashedPassword = await hash(validatedData.password, 10)

      const user = await User.create({
        ...validatedData,
        password: hashedPassword,
      })

      res.status(201).json({ success: true, message: 'User created successfully' })
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

