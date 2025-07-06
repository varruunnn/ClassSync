const authorizeTeacher = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'teacher')) {
        next(); 
    } else {
        return res.status(403).json({ message: 'Access denied. Requires Admin or Teacher role.' });
    }
};

export default authorizeTeacher;