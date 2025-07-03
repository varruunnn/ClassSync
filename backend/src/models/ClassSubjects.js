import mongoose from 'mongoose';
const ClassSubjectsSchema = new mongoose.Schema({
  className: {      
    type: String,
    required: true,
    unique: true
  },
  subjects: [
    {
      name: {
        type: String,
        required: true
      },
      syllabusPdfUrl: {
        type: String,
        required: false 
      }
    }
  ]
});
export default mongoose.model('ClassSubjects', ClassSubjectsSchema);
