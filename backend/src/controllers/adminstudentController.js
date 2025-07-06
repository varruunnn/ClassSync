import User from '../models/User.js';
export const getStudentsBySchool = async (req, res) => {
  try {
    const paramSid = Number(req.params.schoolId);
    if (isNaN(paramSid)) {
      return res
        .status(400)
        .json({ error: "Invalid schoolId parameter." });
    }
    if (req.schoolId !== paramSid) {
      return res.status(403).json({ error: "Forbidden: wrong school." });
    }

    // build base filter
    const filter = { schoolId: paramSid, role: "student" };

    // optional query filters
    const { class: cls, section } = req.query;
    if (cls) filter.class = cls;
    if (section) filter.section = section;

    const students = await User.find(filter).select(
      "name email class rollNumber parentContact section"
    );

    return res.json({ students });
  } catch (err) {
    console.error("getStudentsBySchool error:", err);
    return res
      .status(500)
      .json({ error: "Server error while fetching students." });
  }
};
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;   
    const paramSid = Number(req.params.schoolId);
    if (req.schoolId !== paramSid) {
      return res.status(403).json({ error: 'Forbidden: wrong school.' });
    }
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid student ID.' });
    }
    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    if (student.role !== 'student' || student.schoolId !== paramSid) {
      return res.status(403).json({ error: 'Forbidden: cannot delete this user.' });
    }
    await User.findByIdAndDelete(id);
    return res.json({ message: 'Student deleted.' });
  } catch (err) {
    console.error('deleteStudent error:', err);
    return res.status(500).json({ error: 'Server error while deleting student.' });
  }
};
