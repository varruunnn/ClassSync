import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    required: true,
    default: 'student',
  },
  schoolId: {
    type: Number,
    ref: 'School',
    required: true,
  },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;
