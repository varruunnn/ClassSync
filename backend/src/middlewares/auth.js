import jwt from 'jsonwebtoken';

export default function (req, res, next) { 
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};
