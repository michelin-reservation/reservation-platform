const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    // 헤더에서 토큰 가져오기
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.'
      });
    }

    // Bearer 토큰에서 실제 토큰 부분만 추출
    const token = authHeader.split(' ')[1];

    try {
      // 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 사용자 정보 조회
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '유효하지 않은 토큰입니다.'
        });
      }

      // 요청 객체에 사용자 정보 추가
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
}; 