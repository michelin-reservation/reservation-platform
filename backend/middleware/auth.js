const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: '인증 토큰이 필요합니다.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: '토큰 형식이 올바르지 않습니다.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user_id, user_type 등 저장
    next();
  } catch (err) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
}; 