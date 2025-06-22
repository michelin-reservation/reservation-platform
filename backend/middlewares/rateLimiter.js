const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1분
    max: 10, // 1분당 10회
    message: {
        message: '너무 많은 요청을 보냈습니다. 1분 후에 다시 시도해주세요.',
        code: 'TOO_MANY_REQUESTS',
    },
    standardHeaders: true, // `RateLimit-*` 헤더를 응답에 포함
    legacyHeaders: false, // `X-RateLimit-*` 헤더 비활성화
});

module.exports = {
    apiLimiter
};