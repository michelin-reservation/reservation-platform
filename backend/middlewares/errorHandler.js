module.exports = (err, req, res, next) => {
  console.error('[에러 발생]', err);

  // 기본 응답 형식
  const statusCode = err.statusCode || 500;
  const message = err.message || '서버 내부 오류';
  const errorType = err.name || 'InternalError';

  // Prisma, JWT 등 세분화된 에러 분기 예시 (선택 사항)
  if (errorType === 'JsonWebTokenError') {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }

  if (errorType === 'TokenExpiredError') {
    return res.status(401).json({ message: '토큰이 만료되었습니다.' });
  }

  if (errorType === 'SequelizeValidationError') {
    return res.status(400).json({
      message: '유효성 검사 실패',
      details: err.errors?.map(e => e.message)
    });
  }

  // 프로덕션 환경에서는 민감한 오류 숨김
  if (process.env.NODE_ENV === 'production') {
    return res.status(statusCode).json({
      message,
    });
  }

  // 개발 환경에서는 전체 스택 응답
  return res.status(statusCode).json({
    message,
    stack: err.stack,
    errorType,
  });
};