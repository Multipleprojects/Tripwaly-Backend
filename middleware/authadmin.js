const jwt = require('jsonwebtoken');
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).send('Access denied. Admin token not provided.');
  }

  try {
    const decoded = jwt.verify(token, 'whynot123'); // Use the same secret as when generating the token
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    res.status(401).send('Invalid token.');
  }
};
