// role: '관리자', 'VIP', '일반' 등
module.exports = function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    try {
      const user = req.user; // JWT에서 파싱된 사용자 객체

      if (!user || !user.role) {
        return res.status(403).json({ message: '접근 권한이 없습니다.' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: '해당 역할로 접근할 수 없습니다.' });
      }

      next(); // 접근 허용
    } catch (err) {
      console.error('[role.js] 권한 체크 중 오류:', err);
      return res.status(500).json({ message: '서버 오류' });
    }
  };
};