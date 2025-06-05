import User from '../models/User.js';
// currently this is working as user login as teacher or student its getting reflected in admin
// http://localhost:3001/api/admin/1/stats
// i have takeen schoolId as 1
export const getSchoolStats = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const totalStudents = await User.countDocuments({
      schoolId,
      role: 'student',
    });
    const totalTeachers = await User.countDocuments({
      schoolId,
      role: 'teacher',
    });
    return res.json({
      totalStudents,
      totalTeachers,
    });
  } catch (err) {
    console.error('Error in getSchoolStats:', err);
    return res.status(500).json({ error: 'Server error while fetching stats.' });
  }
};
