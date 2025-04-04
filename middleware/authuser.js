// middleware/auth.js
const jwt = require('jsonwebtoken');
const authuser = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. User token not provided.' });
    }
    try {
        const decoded = jwt.verify(token, 'whynot123'); // Use your secret key
        req.user = decoded; // Attach user information to request object
        next();
    } catch (error) {
        res.status(400).json({ message: 'You need to login first to book a tour' });
    }
};
module.exports = authuser;
