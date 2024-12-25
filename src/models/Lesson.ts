import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  subject: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);

