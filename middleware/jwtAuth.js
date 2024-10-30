const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).send('Access Denied');
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  
  if (!token) return res.status(401).send('Access Denied');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        errors: [{ msg: 'No token provided' }] 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      errors: [{ msg: 'Invalid token' }] 
    });
  }
};
