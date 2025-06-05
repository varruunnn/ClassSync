import jwt from 'jsonwebtoken';

export default function protect(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "No token, authorization denied" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.schoolId = decoded.schoolId; 
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid" });
  }
}
