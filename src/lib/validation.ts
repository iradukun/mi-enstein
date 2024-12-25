import { z } from 'zod'

export const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  content: z.string().min(1, 'Content is required'),
  subject: z.string().min(1, 'Subject is required'),
})

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['teacher', 'student'], { required_error: 'Role must be either teacher or student' }),
})

