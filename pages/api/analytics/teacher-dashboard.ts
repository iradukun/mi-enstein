import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongodb'
import UserActivity from '../../../models/UserActivity'
import Lesson from '../../../models/Lesson'
import { authMiddleware, authorizeRoles } from '../../../lib/authMiddleware'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await dbConnect()

      // Fetch student engagement data
      const studentEngagement = await UserActivity.aggregate([
        { $match: { activityType: 'ask_question' } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          activeStudents: { $addToSet: "$userId" },
          questionsAsked: { $sum: 1 }
        }},
        { $project: {
          date: "$_id",
          activeStudents: { $size: "$activeStudents" },
          questionsAsked: 1,
          _id: 0
        }},
        { $sort: { date: 1 } },
        { $limit: 7 }
      ])

      // Fetch lesson completion rate
      const lessonCompletionRate = await Lesson.aggregate([
        { $match: { teacherId: req.user.id } },
        { $lookup: {
          from: 'useractivities',
          localField: '_id',
          foreignField: 'details.lessonId',
          as: 'activities'
        }},
        { $project: {
          week: { $week: "$createdAt" },
          isCompleted: {
            $cond: [{ $gte: [{ $size: "$activities" }, 5] }, 1, 0]
          }
        }},
        { $group: {
          _id: "$week",
          totalLessons: { $sum: 1 },
          completedLessons: { $sum: "$isCompleted" }
        }},
        { $project: {
          week: "$_id",
          completionRate: {
            $multiply: [{ $divide: ["$completedLessons", "$totalLessons"] }, 100]
          },
          _id: 0
        }},
        { $sort: { week: 1 } },
        { $limit: 10 }
      ])

      // Fetch most popular subjects
      const popularSubjects = await Lesson.aggregate([
        { $match: { teacherId: req.user.id } },
        { $group: {
          _id: "$subject",
          students: { $addToSet: "$studentId" }
        }},
        { $project: {
          subject: "$_id",
          students: { $size: "$students" },
          _id: 0
        }},
        { $sort: { students: -1 } },
        { $limit: 5 }
      ])

      res.status(200).json({
        success: true,
        data: {
          studentEngagement,
          lessonCompletionRate,
          popularSubjects
        }
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' })
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' })
  }
}

export default authMiddleware(authorizeRoles('teacher')(handler))

