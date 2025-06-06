import jwt from 'jsonwebtoken';

export default function protect(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId   = decoded.userId;
    req.role     = decoded.role;
    req.schoolId = decoded.schoolId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token is not valid' });
  }
}


