import mongoose from 'mongoose';

const ClassSubjectsSchema = new mongoose.Schema({
  className: {      
    type: String,
    required: true,
    unique: true
  },
  subjects: [{        
    type: String,
    required: true
  }]
});

export default mongoose.model('ClassSubjects', ClassSubjectsSchema);
