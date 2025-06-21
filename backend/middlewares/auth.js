const jwt = require('jsonwebtoken');
// const { User } = require('../../models');
const { User } = require('../models');

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   if (!authHeader) return res.status(401).json({ message: '인증 토큰이 필요합니다.' });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER; // JWT 발급자 (환경변수에서 설정)

/**
 * JWT 기반 사용자 인증 미들웨어
 * 1. Bearer 토큰 형식 검증
 * 2. 토큰 만료/위조 여부 검증 (에러 메시지 분리)
 * 3. DB에서 실제 사용자 조회 및 비밀번호 필드 제외
 * 4. req.user 객체에 인증된 사용자 정보 주입
 * 5. 환경별 에러 응답 처리
 */
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: '인증 토큰이 필요합니다. (형식: Bearer {token})'
    });
  }

  // const token = authHeader.split(' ')[1];
  // if (!token) return res.status(401).json({ message: '토큰 형식이 올바르지 않습니다.' });

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = decoded; // user_id, user_type 등 저장
  //   next();
  // } catch (err) {
  //   return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  // }


  const token = authHeader.split(' ')[1];

  try {
    const verifyOptions = {
      issuer: JWT_ISSUER,
      clockTolerance: 5 // 5초의 시간 오차 허용
    };

    const decoded = jwt.verify(token, JWT_SECRET, verifyOptions);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ message: '인증에 실패했습니다. 존재하지 않는 사용자입니다.' });
    }

    req.user = user.toJSON();
    next();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: '인증 세션이 만료되었습니다. 다시 로그인해 주세요.',
        code: 'TOKEN_EXPIRED'
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: '유효하지 않은 토큰입니다. 다시 로그인해 주세요.',
        code: 'INVALID_TOKEN'
      });
    }

    console.error('[auth.js] 인증 미들웨어 오류:', err);

    // 환경 분기 처리
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({ message: '인증 중 오류가 발생했습니다.' });
    } else {
      return res.status(500).json({
        message: '인증 중 오류가 발생했습니다.',
        error: err.message
      });
    }
  }
}

module.exports = { authenticateToken };