import mongoose from 'mongoose'

const UserActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityType: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
})

export default mongoose.models.UserActivity || mongoose.model('UserActivity', UserActivitySchema)

