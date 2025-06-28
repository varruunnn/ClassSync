import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function protect(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ Fetch user from DB
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Attach to request
    req.user = user;
    req.role = user.role;
    req.schoolId = user.schoolId;
    
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ error: 'Token is not valid' });
  }
}
