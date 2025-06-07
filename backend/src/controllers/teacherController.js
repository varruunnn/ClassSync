import User from '../models/User.js';

export const getAllTeachers = async (req, res) => {
  try {
    const schoolId = req.schoolId; 
    const teachers = await User.find({ role: 'teacher', schoolId });

    const formatted = teachers.map(t => ({
      id: t._id,
      name: t.name,
      subject: t.subject || 'Unknown',
      email: t.email,
      phone: t.phone || '',
      classAssigned: t.classAssigned || null,
      status: 'active',
    }));

    res.json({ teachers: formatted });
  } catch (err) {
    console.error('Failed to get teachers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
