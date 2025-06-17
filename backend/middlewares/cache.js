const redis = require('../../../reservation-platform-main/backend/config/redis');

// 캐시 미들웨어
const cache = (duration) => {
  return async (req, res, next) => {
    // GET 요청만 캐시
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedResponse = await redis.get(key);
      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      // 원본 응답 메서드 저장
      const originalJson = res.json;
      res.json = function (body) {
        // 응답을 캐시에 저장
        redis.setex(key, duration, JSON.stringify(body));
        return originalJson.call(this, body);
      };

      next();
    } catch (err) {
      console.error('캐시 에러:', err);
      next();
    }
  };
};

// 캐시 삭제 미들웨어
const clearCache = (pattern) => {
  return async (req, res, next) => {
    try {
      const keys = await redis.keys(`cache:${pattern}`);
      if (keys.length > 0) {
        await redis.del(keys);
      }
      next();
    } catch (err) {
      console.error('캐시 삭제 에러:', err);
      next();
    }
  };
};

module.exports = { cache, clearCache };