import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is missing or doesn't start with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Authentication token missing' });

  // Extract the token string from the "Bearer <token>" format
  const token = authHeader.split(' ')[1];

  try {
    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload (emp_id, role, group_id) to request object
    req.user = decoded;

    // Proceed to the next middleware/controller
    next();
  } catch (err) {
    // Token is invalid or expired
    res.status(403).json({ message: 'Invalid token' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Ensure user is authenticated and their role is permitted
    if (!req.user || !roles.includes(req.user.role))
      return res.status(403).json({ message: 'Access denied' });

    // User has required role, proceed
    next();
  };
};
