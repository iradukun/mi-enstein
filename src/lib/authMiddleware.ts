import { NextApiRequest, NextApiResponse } from 'next'
import UserDocument from '../models/User'
import jwt from 'jsonwebtoken'
import User from '../models/User'
interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    role: string;
  };
}

export function authMiddleware(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string }
      const user = await User.findById(decoded.userId)

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' })
      }

      req.user = { id: user._id, role: user.role }
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }
  }
}

export function authorizeRoles(...roles: string[]) {
  return (req: AuthenticatedRequest, res: NextApiResponse, next: () => void) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    next()
  }
}

