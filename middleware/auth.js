const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Company = require('../models/Company');
const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Admin or Company token not provided' });
  try {
    const decoded = jwt.verify(token, 'whynot123');
    let user;
    if (decoded.adminId) {
      user = await Admin.findById(decoded.adminId);
      req.user = { _id: decoded.adminId, role: 'admin' };
    } else if (decoded.companyId) {
      user = await Company.findById(decoded.companyId);
      req.user = { _id: decoded.companyId, role: 'company' };
    }
    if (!user) return res.status(401).json({ message: 'User not found' });

    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
module.exports = authenticateToken;
