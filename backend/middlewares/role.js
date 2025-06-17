// role: '관리자', 'VIP', '일반' 등
module.exports = (role) => (req, res, next) => {
  if (req.user.user_type !== role) {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }
  next();
}; 