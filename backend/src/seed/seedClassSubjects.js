import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ClassSubjects from '../models/ClassSubjects.js';

dotenv.config();

const data = [
  { className: '11A', subjects: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'] },
  { className: '11B', subjects: ['Mathematics', 'Biology', 'Chemistry', 'Physical Education', 'English'] },
];
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    await ClassSubjects.deleteMany();
    console.log('Old ClassSubjects cleared');
    await ClassSubjects.insertMany(data);
    console.log('ClassSubjects seeded');
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();