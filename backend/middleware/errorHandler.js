module.exports = (err, req, res, next) => {
  console.error(err); // 운영 시 winston 등으로 대체 가능
  res.status(err.status || 500).json({
    code: err.code || 'SERVER_ERROR',
    message: err.message || '서버 오류가 발생했습니다.',
    data: err.data || null
  });
}; 