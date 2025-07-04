export default function authorizeTeacher(req, res, next) {
  if (req.user.role !== 'teacher') {
    res.status(403);
    throw new Error('Not authorized — teachers only');
  }
  next();
}
