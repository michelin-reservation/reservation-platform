module.exports = (req, res, next) => {
  if (req.user?.user_type !== '관리자') {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  next();
}; 